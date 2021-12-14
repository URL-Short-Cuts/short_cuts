import { useState } from "react";
import useAnalytics from "./analytics";
import ApiClient from "../clients/api.client.class";
import routes from "../config/apiRoutes";
import Events from "../events/events";
import type {
  UrlCreateResponseType,
  UrlCreateRequestType,
} from "../types/api/hooks.d";

const useUrl = () => {
  const analytics = useAnalytics();
  const [response, setResponse] = useState<UrlCreateResponseType>({
    status: null,
    url: null,
  });

  const resetCreateUrl = () => {
    setResponse({
      status: null,
      url: null,
    });
  };

  const createUrl = async (url: string) => {
    analytics.event(Events.URL.Request);
    const client = new ApiClient();
    const response = await client.post<
      UrlCreateRequestType,
      UrlCreateResponseType
    >(routes.v1.urls, {
      url,
    });
    //const response = { response: { url: "yep worked" }, status: 200 };
    if ((response.response as UrlCreateResponseType).url) {
      analytics.event(Events.URL.Success);
      setResponse({
        status: response.status,
        url: (response.response as UrlCreateResponseType).url,
      });
    } else {
      analytics.event(Events.URL.Error);
      setResponse({
        status: response.status,
        url: null,
      });
    }
  };

  return {
    created: response.url,
    createUrl,
    resetCreateUrl,
    status: response.status,
  };
};

export default useUrl;
