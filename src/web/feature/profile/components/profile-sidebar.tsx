import React from "react";
import styled from "styled-components";
import { colors } from "@/common/colors";
import Layout from "antd/lib/layout";
import { Button, Input, Skeleton, Space, Typography } from "antd";
import {
  CaptionerFields,
  CaptionerPrivateFields,
} from "@/common/feature/captioner/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import Form from "antd/lib/form/Form";
import { Controller, useForm } from "react-hook-form";
import { EditProfileFields } from "@/common/feature/profile/types";
import { WSButton } from "@/common/components/ws-button";
import { WSMarkdown } from "@/common/components/ws-markdown";
const { Title, Text, Link } = Typography;
const { Sider } = Layout;
const { TextArea } = Input;

const ProfileSider = styled(Sider)`
  &.ant-layout-sider {
    padding: 0 20px 20px;
    background-color: ${colors.white};
  }
  .ant-layout-sider-children {
    border-top: 1px ${colors.divider} solid;
    padding-top: 10px;
  }
`;

const ProfileMessage = styled(Text)`
  display: inline-block;
  margin-bottom: 20px;
`;

export const ProfileSidebar = ({
  captioner,
  privateData,
  loggedInUser,
  isEditing,
  isLoading,
  onSubmit,
  onAssignReviewerManager,
  onAssignReviewer,
  onVerifyCaptioner,
  onBanCaptioner,
}: {
  captioner: CaptionerFields; // The user that is being viewed
  privateData?: CaptionerPrivateFields; // The private data of the user being viewed
  loggedInUser?: CaptionerFields; // The logged in user that's viewing this profile
  isLoading: boolean;
  isEditing: boolean;
  onSubmit?: (form: EditProfileFields) => void;
  onAssignReviewerManager: () => void;
  onAssignReviewer: () => void;
  onVerifyCaptioner: () => void;
  onBanCaptioner: () => void;
}) => {
  const { handleSubmit, control } = useForm<EditProfileFields>();
  const {
    profileMessage,
    donationLink,
    isReviewerManager: isProfileUserReviewerManager,
    isReviewer: isProfileUserReviewer,
  } = captioner;

  const isReviewerManager = loggedInUser
    ? loggedInUser.isReviewerManager
    : false;
  const isAdmin = loggedInUser ? loggedInUser.isAdmin : false;

  const renderAdminBar = () => {
    if (!isReviewerManager && !isAdmin) {
      return null;
    }
    if (isLoading) {
      return null;
    }
    const canAssignReviewerManager = isAdmin;
    const canVerify = isAdmin;
    const canBan = isAdmin;
    const canAssignReviewer = isAdmin || isReviewerManager;

    return (
      <>
        <Title level={4}>Admin tools</Title>
        <Space direction={"vertical"}>
          {canAssignReviewerManager && (
            <div>
              <Button onClick={onAssignReviewerManager}>
                {isProfileUserReviewerManager
                  ? "Remove Reviewer Manager Role"
                  : "Assign Reviewer Manager Role"}
              </Button>
            </div>
          )}
          {canAssignReviewer && !isProfileUserReviewerManager && (
            <div>
              <Button onClick={onAssignReviewer}>
                {isProfileUserReviewer
                  ? "Remove Reviewer Role"
                  : "Assign Reviewer Role"}
              </Button>
            </div>
          )}
          {canVerify && (
            <div>
              <Button onClick={onVerifyCaptioner}>
                {captioner.verified ? "Unverify" : "Verify"}
              </Button>
            </div>
          )}
          {canBan && (
            <div>
              <Button onClick={onBanCaptioner}>
                {captioner.banned ? "Unban" : "Ban"}
              </Button>
            </div>
          )}
        </Space>
      </>
    );
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} style={{ display: "flex" }}>
      <ProfileSider width={"420px"}>
        <Skeleton loading={isLoading}>
          <div>
            <Title level={3}>
              About{" "}
              {isEditing && (
                <Text style={{ fontSize: "0.5em" }}>
                  <Link
                    href="https://www.markdownguide.org/cheat-sheet/"
                    target="_blank"
                  >
                    (Formatting in Markdown is supported)
                  </Link>
                </Text>
              )}
            </Title>
            {!isEditing && (
              <ProfileMessage>
                <WSMarkdown source={profileMessage} />
              </ProfileMessage>
            )}
            {isEditing && (
              <>
                <Controller
                  name={"profileMessage"}
                  as={TextArea}
                  control={control}
                  defaultValue={profileMessage}
                  style={{ height: "400px" }}
                />
              </>
            )}
          </div>
          {donationLink && (
            <div>
              <Title level={3}>
                Donate <FontAwesomeIcon icon={faHandHoldingUsd} />
              </Title>
              {!isEditing && (
                <ProfileMessage>
                  <Link
                    target="_blank"
                    href={donationLink}
                    style={{ fontSize: "1.2em" }}
                  >
                    {donationLink}
                  </Link>
                </ProfileMessage>
              )}
              {isEditing && (
                <div style={{ marginBottom: "20px" }}>
                  <Controller
                    name={"donationLink"}
                    as={Input}
                    type={"url"}
                    control={control}
                    defaultValue={donationLink}
                  />
                </div>
              )}
            </div>
          )}
          {isEditing && (
            <div style={{ textAlign: "right" }}>
              <WSButton
                style={{ marginTop: "20px" }}
                loading={isLoading}
                htmlType="submit"
              >
                Save
              </WSButton>
            </div>
          )}
        </Skeleton>
        {renderAdminBar()}
      </ProfileSider>
    </Form>
  );
};