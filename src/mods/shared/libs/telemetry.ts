import { UserInteractionInstrumentation } from '@fonoster/opentelemetry-user-interaction'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'

import { SentrySpanExporter } from './SentrySpanExporter'

const provider = new WebTracerProvider()

const processor =
  process.env.NODE_ENV === 'production'
    ? new BatchSpanProcessor(new SentrySpanExporter())
    : new SimpleSpanProcessor(new SentrySpanExporter())

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
