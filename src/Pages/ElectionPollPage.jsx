import React, { useEffect, useState, useContext } from "react";
import NitDgpHeader from "../Component/NitDgpHeader";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "../Component/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import GlugFooter from "../Component/GlugFooter";
import AuthContext from "../Context/AuthContext";
import { getElection, voteCandidate } from "../Services/api";
import useBlockBackNavigation from "../custom-hooks/useBlockBackNavigation";

function ElectionPollPage() {
  useBlockBackNavigation();
  const { authToken, userDetails, logout } = useContext(AuthContext);
  const { id } = useParams();
  
  const [position, setPosition] = useState();
  const [candidateArray, setCandidateArray] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [maxVotes, setMaxVotes] = useState(1); // Default 1, updated from API
  const navigate = useNavigate();
  const location = useLocation();
  const elections = location.state?.elections || [];
  const currentIndex = elections.findIndex(election => election.id === parseInt(id));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    electionDetails(id);
  }, [id]);

  const electionDetails = async (id) => {
    const res = await getElection(id, authToken);
    if (res.metadata.success) {
      let data = res.payload;
      setPosition(data.role);
      setCandidateArray(data.Candidates);
      setMaxVotes(data.max_votes); // Fetch max_votes from backend
    }
  };

  const handleSelectCandidate = (candidate) => {
    if (selectedCandidates.includes(candidate.id)) {
      setSelectedCandidates(selectedCandidates.filter((id) => id !== candidate.id));
    } else if (selectedCandidates.length < maxVotes) {
      setSelectedCandidates([...selectedCandidates, candidate.id]);
    }
  };

  const vote = async () => {
    const res = await voteCandidate(id, selectedCandidates, authToken);
    if (res.metadata.success) {
      if (currentIndex < elections.length - 1) {
        navigate(`/dashboard/vote/${elections[currentIndex + 1].id}`, { state: { elections } });
      } else {
        logout();
        navigate("/thankyou");
      }
    }
  };

  return (
    <div className="bg-amber-50 h-screen overflow-y-scroll relative">
      <NitDgpHeader />
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="text-2xl font-semibold">Hey, {userDetails.username}</div>
        <div className=" text-red-600">Select <b>{maxVotes}</b> candidates to vote.</div>
      </div>

      <div className="capitalize my-3 w-4/5 mx-auto font-bold text-3xl">
        {position} Candidates:
      </div>

      <div>
        {candidateArray.length > 0 && candidateArray.map((ele) => (
          <div
            key={ele.id}
            className={`cursor-pointer rounded-xl shadow-xl px-5 py-4 w-4/5 mx-auto flex items-center my-3 ${
              selectedCandidates.includes(ele.id) ? "bg-green-300" : "bg-primary"
            }`}
            onClick={() => handleSelectCandidate(ele)}
          >
            <div>
              <img
                src={`${process.env.REACT_APP_API_URL}/candidateImages${ele.image}`}
                className="h-12 w-16 rounded-full"
                alt=""
              />
            </div>
            <div className="w-1/2 ps-4">
              <span className="text-xl font-semibold">{ele.name}</span>
              <br />
              <span>{ele.department}</span>
              <br />
              <span>{ele.Roll}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`flex justify-center mt-5 `}>
        <button  className={` ${
    selectedCandidates.length !== maxVotes
      ? "bg-gray-400 text-white py-4 px-8 rounded-xl text-xl cursor-not-allowed"  // Disabled state
      : "bg-btn-primary text-white py-4 px-8 rounded-xl text-xl"       // Active state
  }`} onClick={onOpen} disabled={selectedCandidates.length === 0 || selectedCandidates.length !== maxVotes}>
          Confirm Vote
        </button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"2xl"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Your Vote</ModalHeader>
              <ModalBody>
                {selectedCandidates.map((id) => {
                  const candidate = candidateArray.find((ele) => ele.id === id);
                  return (
                    <div
                      key={id}
                      className="rounded-xl shadow-lg bg-amber-100/30 px-5 py-4 w-full mx-auto flex items-center my-3"
                    >
                      <div>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/candidateImages${candidate.image}`}
                          className="h-12 w-16 rounded-full"
                          alt=""
                        />
                      </div>
                      <div className="w-1/2 ps-4">
                        <span className="text-xl font-semibold">{candidate.name}</span>
                        <br />
                        <span>{candidate.department}</span>
                        <br />
                        <span>{candidate.Roll}</span>
                      </div>
                    </div>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button
                  onClick={() => {
                    vote();
                    onClose();
                  }}
                  color="primary"
                  disabled={selectedCandidates.length === 0}
                >
                  Vote and Continue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <GlugFooter />
    </div>
  );
}

export default ElectionPollPage;
