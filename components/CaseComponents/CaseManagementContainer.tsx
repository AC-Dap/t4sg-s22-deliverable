import React from "react";
import Button from "react-bootstrap/Button";
import { Container } from "reactstrap";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import "../../styles/casemanagement.module.css";
import Footer from "./Footer";
import CaseCategory from "./CaseCategory";
import AddCaseModal from "./Modals/AddCaseModal";
import { useQuery } from "urql";
import AddCategoryModal from "./Modals/AddCategoryModal";
import AddTagModal from "./Modals/AddTagModal";

// TODO: don't need name?
export const ManagementContainerQuery = `
query MyQuery {
  category {
    id
    name
  }
}
`;
// END TODO

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

  /* NOTE: This uses */
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  return (
    <>
      <h5 className="title">Home Page</h5>
      <Grid container spacing={3}>
        {fetching ? (
            "Loading categories..."
        ) : (
            data.category.map((category: ManagementCategory) => (
                <Grid item xs={4} key={category.id}>
                    <CaseCategory category_id={category.id}/>
                </Grid>
            ))
        )}
      </Grid>

      <AddCaseModal
        onClose={() => setAddCaseModalOpen(false)}
        open={addCaseModalOpen}
      />

      <AddCategoryModal
        onClose={() => setAddCategoryModalOpen(false)}
        open={addCategoryModalOpen}
      />

      <AddTagModal
        onClose={() => setAddTagModalOpen(false)}
        open={addTagModalOpen}
      />

      <Container
        style={{
          width: "100%",
          borderStyle: "solid",
          padding: "0.75rem",
          marginTop: "0.75rem",
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
        <Button variant="dark" onClick={() => "redirect"}>
          Delete Case
        </Button>
        <Button variant="dark" onClick={() => "redirect"}>
          Edit Case
        </Button>
      </Container>
    </>
  );
};
export default CaseManagementContainer;
