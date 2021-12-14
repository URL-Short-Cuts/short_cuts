// tslint:disable:no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    HOSTNAME: string;
    NEXT_PUBLIC_ANALYTICS_UA_CODE: string;
    SHORT_CUTS_AWS_ACCESS_KEY: string;
    SHORT_CUTS_AWS_SECRET_ACCESS_KEY: string;
    SHORT_CUTS_AWS_REGION: string;
    SHORT_CUTS_URL_BUCKET: string;
    SHORT_CUTS_DYNAMO_DB_TABLE: string;
  }
}
