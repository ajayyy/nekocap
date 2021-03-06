import { OffsetRequest, PagedType, ServerResponse } from "@/common/types";
import { CaptionListFields, VideoFields } from "../video/types";

export type SearchState = {
  currentResultPage: number;
  totalResults: number;
  captions: CaptionListFields[];
  videos: VideoFields[];
  hasMoreResults: boolean;
};

export type SearchFields = {
  title: string;
  videoLanguageCode?: string;
  captionLanguageCode?: string;
};

export type SearchParams = PagedType &
  SearchFields & {
    append?: boolean; // whether the results should be appended
  };

export type SearchRequest = OffsetRequest & SearchFields;

export type SearchResults = ServerResponse & {
  captions: CaptionListFields[];
};

export type VideoSearchResults = ServerResponse & {
  videos: VideoFields[];
  hasMoreResults: boolean;
};

export type SetVideoSearchResults = {
  videos: VideoFields[];
  hasMoreResults: boolean;
  currentResultPage: number;
  append: boolean;
};
