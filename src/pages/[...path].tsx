import apiRoutes from "../config/apiRoutes";
import type { GetServerSideProps } from "next";

export default function Redirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let path = "_";
  if (context.query.path) path = context.query.path[0];
  return {
    redirect: {
      destination: apiRoutes.v1.urls + "/" + path,
      permanent: false,
    },
  };
};
