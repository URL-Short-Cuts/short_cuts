import type { NextApiRequest } from "next";

export interface APIRequest extends NextApiRequest {
  error?: string;
}
