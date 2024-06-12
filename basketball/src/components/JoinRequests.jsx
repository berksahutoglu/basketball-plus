import React from "react";
import { Button, ButtonGroup } from "@mui/material";

const JoinRequests = ({ request, onResponse }) => {
  return (
    <li>
      {request.message}
      <div>
        {request.status === "approved" ? (
          <div>{request.username}Onaylandı</div>
        ) : request.status === "rejected" ? (
          <div>Reddedildi</div>
        ) : (
          <ButtonGroup>
            <Button
              color="success"
              onClick={() => onResponse("approved", request.id)}
            >
              Onayla
            </Button>
            <Button
              color="error"
              onClick={() => onResponse("rejected", request.id)}
            >
              Reddet
            </Button>
          </ButtonGroup>
        )}
      </div>
    </li>
  );
};
export default JoinRequests;
