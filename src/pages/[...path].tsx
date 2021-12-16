import apiRoutes from "../config/apiRoutes";
import routes from "../config/routes";
import type { GetServerSideProps } from "next";

export default function Redirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Although the original implementation of this was really nice and simple
  // This alternative is a bit more respective of REST
  let path = "_";
  let destination = routes[404];
  let statusCode: 301 | 302 = 302;

  if (context.query.path && context.query.path.length > 0)
    path = context.query.path[0];
  const response = await fetch(
    process.env.HOSTNAME + apiRoutes.v1.urls + "/" + path
  );
  if (response.status === 200) {
    destination = String((await response.json()).url);
    statusCode = 301 as const;
  }
  return {
    redirect: {
      statusCode,
      destination,
    },
  };
};
