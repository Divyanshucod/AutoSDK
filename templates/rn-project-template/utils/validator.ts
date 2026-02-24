export const validateConfig = ({ form, mode, cpr }) => {

 if(!form.workflowId) return "workflowId required";
 if(!form.transactionId) return "transactionId required";

 if(mode==="token" && !form.accessToken)
   return "accessToken required";

 if(mode==="app" && (!form.appId || !form.appKey))
   return "appId & appKey required";

 if(cpr && !form.uniqueId)
   return "uniqueId required";

 return null;
};