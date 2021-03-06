import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { searchFromBasicBar } from "@/common/feature/search/actions";
import SearchOutlined from "@ant-design/icons/SearchOutlined";
import { styledNoPass } from "@/common/style-utils";

type SearchRowProps = {
  opened?: boolean;
};

const SearchRow = styledNoPass<SearchRowProps>("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  input {
      width: ${({ opened }) => (opened ? "100%" : "0px")};
      padding-left: ${({ opened }) => (opened ? "11px" : "0px")};
      padding-right: ${({ opened }) => (opened ? "11px" : "0px")};
      opacity: ${({ opened }) => (opened ? "1" : "0")};
      transition: width 300ms ease-out, padding-left 300ms ease-out, padding-right 300ms ease-out;
  }

  > *:not(:last-child) {
    margin-right: 8px;
  }
`;

type BasicSearchForm = {
  title: string;
};

export const BasicSearchBar = () => {
  const { control, handleSubmit } = useForm<BasicSearchForm>();
  const dispatch = useDispatch();
  const [opened, setOpened] = useState(false);

  const onSearch = (form: BasicSearchForm) => {
    dispatch(searchFromBasicBar(form.title));
  };

  const openSearch = () => {
    setOpened(true);
  };

  const handleClickSearch = opened ? handleSubmit(onSearch) : openSearch;

  return (
    <div>
      <Form onSubmitCapture={handleClickSearch}>
        <SearchRow opened={opened}>
          {
            <Controller
              as={Input}
              control={control}
              name="title"
              defaultValue={""}
              placeholder={"Search for a video"}
              style={{ fontSize: "15px" }}
              rules={{
                required: true,
              }}
            />
          }
          <Button style={{ height: "100%" }} htmlType={"submit"}>
            <SearchOutlined style={{ fontSize: "16px" }} />
          </Button>
        </SearchRow>
      </Form>
    </div>
  );
};
