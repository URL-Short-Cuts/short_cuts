// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { STATUS_200_MESSAGE } from "../../../config/status";
import type { StatusMessageType } from "../../../types/api/status";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  detail: StatusMessageType["detail"];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe", detail: STATUS_200_MESSAGE.detail });
}
