import { knownStatuses } from "../config/api";
import type {
  ApiResponse,
  FetchResponse,
  StatusMessageType,
} from "../types/api/client.d";

class APIClient {
  private handleKnownStatuses(response: FetchResponse): FetchResponse {
    if (response.status in knownStatuses) {
      return {
        ok: true,
        headers: response.headers,
        status: response.status,
        json: () => Promise.resolve(knownStatuses[response.status]),
      } as FetchResponse;
    }
    return response;
  }

  post = async <POSTDATA, RESPONSE>(
    url: string,
    postData: POSTDATA
  ): Promise<ApiResponse<RESPONSE>> => {
    let fetchResponse = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "same-origin",
      body: JSON.stringify(postData),
    });

    fetchResponse = this.handleKnownStatuses(fetchResponse);

    const json: RESPONSE | StatusMessageType = await fetchResponse.json();
    return {
      status: fetchResponse.status,
      headers: this.getHeaders(fetchResponse),
      response: json,
    };
  };

  private getHeaders(response: FetchResponse) {
    const headers: Record<string, string> = {};
    for (const [key, value] of response.headers) {
      headers[key] = value;
    }
    return headers;
  }
}

export default APIClient;
