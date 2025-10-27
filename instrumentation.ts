// Temporarily disable OpenTelemetry to fix startup issues
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
// import { Resource } from '@opentelemetry/resources';
// import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Initialize OpenTelemetry SDK
// const sdk = new NodeSDK({
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: 'openkb-app',
//     [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
//   }),
//   traceExporter: new OTLPTraceExporter({
//     url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4319/v1/traces',
//   }),
//   metricExporter: new OTLPMetricExporter({
//     url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4320/v1/metrics',
//   }),
//   instrumentations: [
//     getNodeAutoInstrumentations({
//       // Disable some instrumentations that might cause issues
//       '@opentelemetry/instrumentation-fs': {
//         enabled: false,
//       },
//     }),
//   ],
// });

// Start the SDK
// sdk.start();

// Graceful shutdown
// process.on('SIGTERM', () => {
//   sdk.shutdown()
//     .then(() => console.log('OpenTelemetry terminated'))
//     .catch((error) => console.log('Error terminating OpenTelemetry', error))
//     .finally(() => process.exit(0));
// });

// export default sdk;
