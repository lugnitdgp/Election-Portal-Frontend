import * as RESTAPI from "./axios";

export const totalVotes = () => RESTAPI.GET("/api/totalvotes");
export const LoginMember = (data) => RESTAPI.POST("/api/login", data);
export const ListEligibleElections = (token) => RESTAPI.GET("/api/election", token);
export const ListAdminElections = (token) => RESTAPI.GET("/api/admin/election", token);
export const getElection = (election_id, token) => RESTAPI.GET(`/api/election/${election_id}`, token);
export const getResult = (election_id, token) => RESTAPI.GET(`/api/admin/result/${election_id}`, token);
export const voteCandidate = (election_id,candidateIDs ,token) => RESTAPI.POST(`/api/vote/${election_id}`,{candidates:candidateIDs}, token);

