import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "fin_api"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "fin_api"
          : defaultOptions.database,
    })
  );
};
