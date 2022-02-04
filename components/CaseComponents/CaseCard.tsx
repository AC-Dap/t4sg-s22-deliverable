import React, {useState} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import {useMutation, useQuery} from "urql";
import {Box, Checkbox, FormControl, MenuItem, Select} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

type CaseCardProps = {
  data: CaseData;
  changeCheckedCases: (caseId: number, add: boolean) => void;
};

export type TagData = {
  name: string;
  id?: number;
};

export type CaseData = {
  name: string;
  status: string;
  description: string;
  id: number;
  cases_tags?: [TagData];
};

const UpdateStatusMutation = `
mutation UpdateStatusMutation($id: bigint!, $status: String!) {
  update_cases(where: {id: {_eq: $id}}, _set: {status: $status}) {
    returning {
      id
    }
  }
}
`;

const CaseCard: React.FC<CaseCardProps> = (props) => {
  const caseData = props.data;
  const [status, setStatus] = useState<string>(caseData.status);
  const [selected, setSelected] = useState<boolean>(false);

  const [result, executeMutation] = useMutation(UpdateStatusMutation);

  return (
    <Container>
      <div style={{ width: "100%", padding: "5px" }}>
        <Card body style={{ backgroundColor: "#e4ebf5" }}>
          <Checkbox checked={selected}
                    onChange={(event) => {
                      setSelected(event.target.checked);
                      props.changeCheckedCases(caseData.id, event.target.checked);
                    }}
                    style={{position: "absolute", top: 0, right: 0}}
          />

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <CardTitle tag="h3">{caseData.name}</CardTitle>
            <CloseIcon />
          </Box>

          <FormControl>
            <Select
              value={status}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                console.log(`Case ${caseData.id} status changed to ${event.target.value}`);
                executeMutation({id: caseData.id, status: event.target.value})
                setStatus(event.target.value as string);
              }}
            >
              <MenuItem value={"To Do"}>To Do</MenuItem>
              <MenuItem value={"In Progress"}>In Progress</MenuItem>
              <MenuItem value={"Done"}>Done</MenuItem>
            </Select>
          </FormControl>

          <CardText>{caseData.description}</CardText>
          {/*
            ALTERNATE FEATURE 1 TODO:
            Use the data on tags found in props to render out all
            of the tags associated with every case.
          */}

          {/* END TODO */}
        </Card>
      </div>
    </Container>
  );
};
export default CaseCard;
