import React from "react";
import Button from "react-bootstrap/Button";
import { Container } from "reactstrap";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import "../../styles/casemanagement.module.css";
import Footer from "./Footer";
import CaseCategory from "./CaseCategory";
import AddCaseModal from "./Modals/AddCaseModal";
import {useMutation, useQuery} from "urql";
import AddCategoryModal from "./Modals/AddCategoryModal";
import AddTagModal from "./Modals/AddTagModal";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

export const ManagementContainerQuery = `
query ManagementContainerQuery {
  category {
    id
    name
  }
}
`;

const DeleteCasesMutation = `
mutation DeleteCasesMutation($ids: [bigint!]) {
  delete_cases(where: {id: {_in: $ids}}) {
    returning {
      id
    }
  }
}

`;

export type ManagementCategory = {
  id: number;
  name: string;
};

const CaseManagementContainer: React.FC = (props) => {
  const [addCaseModalOpen, setAddCaseModalOpen] =
    React.useState<boolean>(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] =
    React.useState<boolean>(false);
  const [addTagModalOpen, setAddTagModalOpen] = React.useState<boolean>(false);

  const [checkedCases, setCheckedCases] = React.useState<number[]>([]);

  // Add or remove a case from the list of selected cases
  const changeCheckedCases = (caseId: number, add: boolean) => {
      if(add){
          setCheckedCases([...checkedCases, caseId]);
      }else{
          setCheckedCases(checkedCases.filter(ele => ele != caseId));
      }
  }

  const [deleteCasesDialogOpen, setDeleteCasesDialogOpen] = React.useState<boolean>(false);
    const [result, executeMutation] = useMutation(DeleteCasesMutation);
  const deleteCheckedCases = () => {
      executeMutation({ids: checkedCases}).then((res) => {
          location.reload();
      });
  }

  /* NOTE: This uses */
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  return (
    <>
      <h5 className="title">Home Page</h5>
        <Container
            style={{
                width: "100%",
                maxWidth: "none",
                borderStyle: "solid",
                padding: "0.75rem",
                margin: "0",
                position: "sticky",
                top: 0,
                background: "white",
                zIndex: 2
            }}
        >
            <Button variant="dark" onClick={() => setAddCategoryModalOpen(true)}>
                Add Category
            </Button>
            <Button variant="dark" onClick={() => setAddTagModalOpen(true)}>
                Add Tag To A Case
            </Button>
            <Button variant="dark" onClick={() => setAddCaseModalOpen(true)}>
                Add Case
            </Button>
            <Button variant="dark" onClick={() => setDeleteCasesDialogOpen(true)}>
                Delete Selected Cases
            </Button>
        </Container>

      <Grid container spacing={3}>
        {data ? (
            data.category.map((category: ManagementCategory) => (
                <Grid item xs={4} key={category.id}>
                    <CaseCategory category_id={category.id} changeCheckedCases={changeCheckedCases}/>
                </Grid>
            ))
        ) : fetching ? (
            "Loading categories..."
        ) : null}
      </Grid>

        {/* Kind of hacky to reload the page in order to show
            the new case, but this is the easiest way without
            changing the state to be in this component*/}
        {/*Could also use subscriptions rather than basic queries, but
        that seems like overkill*/}
      <AddCaseModal
        onClose={() => setAddCaseModalOpen(false)}
        open={addCaseModalOpen}
        onCaseAdded={() => location.reload()}
      />

      <AddCategoryModal
        onClose={() => setAddCategoryModalOpen(false)}
        open={addCategoryModalOpen}
        onCategoryAdded={() => location.reload()}
      />

      <AddTagModal
        onClose={() => setAddTagModalOpen(false)}
        open={addTagModalOpen}
      />
        
        <Dialog
            onClose={() => setDeleteCasesDialogOpen(false)}
            open={deleteCasesDialogOpen}>
            <DialogTitle>
                {`Delete ${checkedCases.length} cases?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete these cases? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteCasesDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                    setDeleteCasesDialogOpen(false);
                    deleteCheckedCases();
                }}>Delete</Button>
            </DialogActions>
        </Dialog>
    </>
  );
};
export default CaseManagementContainer;
