import { UserInteractionInstrumentation } from '@fonoster/opentelemetry-user-interaction'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'

const provider = new WebTracerProvider()

const processor =
  process.env.NODE_ENV === 'production'
    ? new BatchSpanProcessor(new ConsoleSpanExporter())
    : new SimpleSpanProcessor(new ConsoleSpanExporter())

provider.addSpanProcessor(processor)

provider.register({ contextManager: new ZoneContextManager() })

if (typeof window !== 'undefined')
  window.addEventListener('load', () =>
    registerInstrumentations({
      instrumentations: [new UserInteractionInstrumentation()],
      tracerProvider: provider,
    })
  )

export const tracer = provider.getTracer('app')
