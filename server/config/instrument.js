import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://312507b480e4c6254977b6112f2abef5@o4508954512916480.ingest.us.sentry.io/4508954520322048",
  integrations:[
    nodeProfilingIntegration(),
    Sentry.mongoIntegration()
  ],

  // tracesSampleRate: 1.0,

});

Sentry.profiler.startProfiler();

Sentry.startSpan({
  name: "My First Transaction"
},()=>{

})

Sentry.profiler.stopProfiler();