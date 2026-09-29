import { useState } from 'react'
import { business, telHref } from '../data/business'

interface Props {
  totalPrice: number
}

export default function PaybillInstructions({ totalPrice }: Props) {
  const [copied, setCopied] = useState(false)
  const phoneHref = telHref()
  const { paybill, account } = business.payment

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `Business No: ${paybill}\nAccount No: ${account}\nAmount: KSh ${totalPrice.toLocaleString('en-KE')}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can fail silently on unsupported browsers — no-op.
    }
  }

  return (
    <div className="border border-gold/30 bg-gold/5 p-4 text-left">
      <p className="text-sm text-cream/70">Pay via M-Pesa Paybill:</p>
      <ol className="mt-2 space-y-1 text-sm text-cream/80">
        <li>1. Go to M-Pesa on your phone</li>
        <li>2. Select "Lipa na M-Pesa", then "Pay Bill"</li>
        <li>
          3. Business Number: <span className="text-gold">{paybill}</span>
        </li>
        <li>
          4. Account Number: <span className="text-gold">{account}</span>
        </li>
        <li>
          5. Amount: <span className="text-gold">KSh {totalPrice.toLocaleString('en-KE')}</span>
        </li>
        <li>6. Enter your M-Pesa PIN and send</li>
      </ol>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 border border-gold/50 px-4 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
      >
        {copied ? 'Copied!' : 'Copy Paybill Details'}
      </button>

      <p className="mt-4 text-sm text-cream/60">
        Once we see your payment, we'll confirm your order and start
        preparing it. If you don't hear from us within 15 minutes of paying,
        please {phoneHref ? (
          <a href={phoneHref} className="text-gold underline underline-offset-4">
            call us at {business.phone}
          </a>
        ) : (
          'call us'
        )}{' '}
        with your M-Pesa confirmation message.
      </p>

      <p className="mt-3 text-xs text-cream/40">
        By placing an order you agree to pay the amount shown via the Paybill
        above. Orders are prepared only once payment is confirmed — please
        keep your M-Pesa confirmation message until your order is complete.
      </p>
    </div>
  )
}
