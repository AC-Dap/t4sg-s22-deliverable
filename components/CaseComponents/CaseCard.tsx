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
import {Box, Button, Checkbox, FormControl, MenuItem, Select} from "@material-ui/core";
import EditIcon from "@material-ui/icons/edit"
import EditCaseModal from "./Modals/EditCaseModal";

type CaseCardProps = {
  data: CaseData;
  changeCheckedCases: (caseId: number, add: boolean) => void;
  onStatusChange: () => void;
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
  category_id: number;
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
  const [selected, setSelected] = useState<boolean>(false);
  const [editCaseModelOpen, setEditCaseModelOpen] = useState<boolean>(false);

  const [result, executeMutation] = useMutation(UpdateStatusMutation);

  return (
    <>
      <Container>
        <div style={{ width: "100%", padding: "5px" }}>
          <Card body style={{ backgroundColor: "#e4ebf5" }}>
            <Box position={"absolute"} top={0} right={0}>
              <Button onClick={() => setEditCaseModelOpen(true)}>
                <EditIcon/>
              </Button>
              <Checkbox
                  checked={selected}
                  onChange={(event) => {
                    setSelected(event.target.checked);
                    props.changeCheckedCases(caseData.id, event.target.checked);
                  }}
              />
            </Box>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
              <CardTitle tag="h3">{caseData.name}</CardTitle>
            </Box>

            <FormControl>
              <Select
                  value={caseData.status}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    executeMutation({id: caseData.id, status: event.target.value}).then((res) => {
                      props.onStatusChange();
                    })
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

      <EditCaseModal
          open={editCaseModelOpen}
          onClose={() => setEditCaseModelOpen(false)}
          onCaseChanged={() => location.reload()}
          initCaseData={caseData}
      />
    </>
  );
};
export default CaseCard;
