import React, {useState} from "react";
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
import {makeStyles, createStyles, Theme} from "@material-ui/core/styles";
import {useMutation, useQuery} from "urql";
import {
    ManagementCategory,
    ManagementContainerQuery,
} from "../CaseManagementContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexWrap: "wrap",
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: "25ch",
        },
    })
);

type AddCaseModalProps = {
    open: boolean;
    onClose: () => void;
    onCaseAdded: () => void;
};

const InsertCaseMutation = `
mutation InsertCaseMutation($category_id: Int!, $description: String, $name: String, $status: String) {
  insert_cases_one(object: {description: $description, status: $status, name: $name, category_id: $category_id}) {
    id
  }
}

`;

const AddCaseModal: React.FC<AddCaseModalProps> = (props) => {
    const classes = useStyles();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [category, setCategory] = useState<number | "">("");
    const [{data, fetching, error}, executeQuery] = useQuery({
        query: ManagementContainerQuery,
    });

    const [result, executeMutation] = useMutation(InsertCaseMutation);

    return (
        <StyledModal open={props.open} onClose={props.onClose}>
            <Typography variant="h4" align="center">
                Add New Case
            </Typography>
            <Box component={"form"} onSubmit={() => {
                executeMutation({
                    description,
                    name,
                    status,
                    category_id: category,
                }).then((res) => {
                    props.onCaseAdded();
                });
                props.onClose();
            }}>
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
                    required
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
                <FormControl required fullWidth>
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
                    <FormControl required fullWidth>
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
                                data.category.map((category: ManagementCategory, i: number) => (
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

                <Box mt="10px" display="flex" justifyContent="center">
                    <Button
                        variant="outlined"
                        type={"submit"}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </StyledModal>
    );
};
export default AddCaseModal;
