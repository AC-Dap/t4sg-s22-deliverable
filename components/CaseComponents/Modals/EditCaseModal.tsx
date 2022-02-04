import React, {useEffect, useState} from "react";
import StyledModal from "./StyledModal";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useMutation, useQuery } from "urql";
import {
    ManagementCategory,
    ManagementContainerQuery,
} from "../CaseManagementContainer";
import {CaseData} from "../CaseCard";

type AddCaseModalProps = {
    open: boolean;
    onClose: () => void;
    onCaseChanged: () => void;
    initCaseData: CaseData;
};

const EditCaseMutation = `
mutation EditCaseMutation($id: bigint!, $category_id: Int!, $description: String, $name: String, $status: String) {
  update_cases(where: {id: {_eq: $id}}, _set: {description: $description, status: $status, name: $name, category_id: $category_id}) {
    returning {
      id
    }
  }
}

`;

const EditCaseModal: React.FC<AddCaseModalProps> = (props) => {
    const [name, setName] = useState<string>(props.initCaseData.name);
    const [description, setDescription] = useState<string>(props.initCaseData.description);
    const [status, setStatus] = useState<string>(props.initCaseData.status);
    const [category, setCategory] = useState<number>(props.initCaseData.category_id);
    const [{ data, fetching, error }, executeQuery] = useQuery({
        query: ManagementContainerQuery,
    });

    // If user manually changed the status, it
    // won't update the state automatically
    if(props.initCaseData.status != status){
        setStatus(props.initCaseData.status);
    }

    const [result, executeMutation] = useMutation(EditCaseMutation);

    return (
        <StyledModal open={props.open} onClose={props.onClose}>
            <Typography variant="h4" align="center">
                Edit Case
            </Typography>
            <Box>
                <TextField
                    id="standard-full-width"
                    label="Name"
                    placeholder="Example Case Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="standard-full-width"
                    label="Description"
                    placeholder="Example Case Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setDescription(event.target.value);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl fullWidth>
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        fullWidth
                        value={status}
                        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                            setStatus(event.target.value as string);
                        }}
                    >
                        <MenuItem value={"To Do"}>To Do</MenuItem>
                        <MenuItem value={"In Progress"}>In Progress</MenuItem>
                        <MenuItem value={"Done"}>Done</MenuItem>
                    </Select>
                </FormControl>
                {data ? (
                    <FormControl fullWidth>
                        <InputLabel id="category-select-label">Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            fullWidth
                            value={category}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                setCategory(event.target.value as number);
                            }}
                        >
                            {
                                // Have placeholder name for categories with no name
                                data.category.map((category: ManagementCategory, i:number) => (
                                    <MenuItem key={i} value={category.id}>
                                        {category.name ? category.name : <i>{`Category ${category.id}`}</i>}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                ) : fetching ? (
                    "Loading Categories"
                ) : null}
            </Box>
            <Box mt="10px" display="flex" justifyContent="center">
                <Button
                    variant="outlined"
                    onClick={() => {
                        executeMutation({
                            id: props.initCaseData.id,
                            description,
                            name,
                            status,
                            category_id: category,
                        }).then((res) => {
                            props.onCaseChanged();
                        });
                        props.onClose();
                    }}
                >
                    Submit
                </Button>
            </Box>
        </StyledModal>
    );
};
export default EditCaseModal;
