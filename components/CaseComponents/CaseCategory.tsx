import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useQuery } from "urql";
import CaseCard, { CaseData } from "./CaseCard";
import {Accordion, AccordionDetails, AccordionSummary} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";

type CaseCategoryProps = {
  category_id: number;
  changeCheckedCases: (caseId: number, add: boolean) => void;
};

type CaseCategoryData = {
  name: string;
  cases: CaseData[];
};

/*
  ALTERNATE FEATURE 1 TODO:
  Use the data on tags found in props to render out all
  of the tags associated with every case.
*/
const CategoryQuery = `
  query CategoryQuery($category_id: bigint = "") {
    category(where: {id: {_eq: $category_id}}, limit: 1) {
      cases {
        name
        status
        description
        id
        category_id
      }
      name
    }
}
`;
/* END TODO */

const CaseCategory = (props: CaseCategoryProps) => {
  const category_id = props.category_id;
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: CategoryQuery,
    variables: { category_id },
  });

  const category: CaseCategoryData | null = data ? data?.category[0] : null;

  return (
    <Accordion defaultExpanded={true} style={{borderStyle: "solid"}}>
      <AccordionSummary expandIcon={<ExpandMore/>}>
        {category ? (
          <h3 className="font-weight-normal t4sg-color text-center">
            {category.name ? category.name : <i>{`Category ${category_id}`}</i>}
          </h3>
        ) : (
          <h3 className="font-weight-normal t4sg-color text-center">
            Something went wrong
          </h3>
        )}
      </AccordionSummary>
      <AccordionDetails>
          <Container>
              {category ?
                  category.cases.map((c: CaseData, index: number) => {
                      return <CaseCard
                          key={index}
                          data={c}
                          changeCheckedCases={props.changeCheckedCases}
                          onStatusChange={() => executeQuery()}
                      />;
                  })
                  : "Something went wrong"
              }
          </Container>
      </AccordionDetails>
    </Accordion>
  );
};

export default CaseCategory;
