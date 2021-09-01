import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import React, { FunctionComponent } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { listAlerts } from "../../lib/alert/alert";
import styles from "./Alerts.module.scss";

const Alerts: FunctionComponent = () => {
  const { data } = useSWR("/alerts", listAlerts);

  if ((data?.length ?? 0) === 0) {
    return null;
  }

  return (
    <motion.div
      className={styles.alerts}
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
    >
      {data!.map((alert) => (
        <div key={alert.sys.id} className={styles.alert}>
          {documentToReactComponents(alert.fields.content as any)}
        </div>
      ))}
    </motion.div>
  );
};
export default Alerts;
