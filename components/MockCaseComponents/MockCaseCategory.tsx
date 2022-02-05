import React from "react";
import { Container, Row, Col } from "reactstrap";
import CaseCard from "../CaseComponents/CaseCard";

type MockCaseCategoryProps = {
  category_id: number;
};

const MockCaseCategory = (props: MockCaseCategoryProps) => {
  return (
    <Container
      style={{
        width: "100%",
        borderStyle: "solid",
        padding: "0.75rem",
      }}
    >
      <Row>
        <Col>
          <h3 className="font-weight-normal t4sg-color text-center">
            Mock Category {props.category_id}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <CaseCard
            data={{
              category_id: 12,
              name: "Mock Case 1",
              status: "In progress",
              description: "First Mock Case",
              id: 1,
            }}
            changeCheckedCases={() => console.log("Mock 1 checked")}
            onStatusChange={() => console.log("Mock 1 changed")}/>
          <CaseCard
            data={{
              category_id: 3,
              name: "Mock Case 2",
              status: "In progress",
              description: "Second Mock Case",
              id: 2,
            }}
            changeCheckedCases={() => console.log("Mock 2 checked")}
            onStatusChange={() => console.log("Mock 2 changed")}/>
        </Col>
      </Row>
    </Container>
  );
};

export default MockCaseCategory;
