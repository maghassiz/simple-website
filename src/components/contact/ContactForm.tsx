import { useState } from 'react';
import { asset } from '../../lib/cdn';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const ENDPOINT = import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT;

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 items-start w-full">
      <label htmlFor={id} className="font-body font-medium text-body-sm text-navy">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-body font-normal text-body-md text-navy placeholder:text-gray bg-light-gray rounded-lg p-4 w-full outline-none focus:ring-2 focus:ring-navy"
      />
    </div>
  );
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ENDPOINT) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const body = new FormData();
      body.append('name', name);
      body.append('hotelName', hotelName);
      body.append('email', email);
      body.append('phone', phone);
      body.append('message', message);

      // Apps Script web apps don't reliably send CORS headers for
      // non-form-encoded bodies, so this is submitted as FormData (a
      // CORS-safelisted content type) to avoid a failing preflight request.
      await fetch(ENDPOINT, { method: 'POST', body });

      setStatus('success');
      setName('');
      setHotelName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="flex justify-center px-[100px] max-lg:px-10 max-md:px-4 pt-20 max-lg:pt-14 max-md:pt-10 pb-[112px] max-lg:pb-14 max-md:pb-16 w-full bg-background">
        <div className="flex flex-col gap-2 items-center text-center max-w-[816px] w-full">
          <p className="font-heading text-h5 text-navy w-full">Thanks for reaching out</p>
          <p className="font-body font-normal text-body-md text-gray w-full">We'll get back to you shortly.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center px-[100px] max-lg:px-10 max-md:px-4 pt-20 max-lg:pt-14 max-md:pt-10 pb-[112px] max-lg:pb-14 max-md:pb-16 w-full bg-background">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-start w-full max-w-[816px]">
        <div className="flex gap-8 max-md:flex-col items-start w-full">
          <Field id="name" label="Name" placeholder="Full name" required value={name} onChange={setName} />
          <Field id="hotelName" label="Hotel name" placeholder="Hotel name" value={hotelName} onChange={setHotelName} />
        </div>
        <div className="flex gap-8 max-md:flex-col items-start w-full">
          <Field id="email" label="Email" type="email" placeholder="jon@hotel.is" required value={email} onChange={setEmail} />
          <Field id="phone" label="Phone number" type="tel" placeholder="Phone number" value={phone} onChange={setPhone} />
        </div>
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="message" className="font-body font-medium text-body-sm text-navy">
            Message
          </label>
          <div className="relative w-full">
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-body font-normal text-body-md text-navy placeholder:text-gray bg-light-gray rounded-lg p-4 w-full outline-none focus:ring-2 focus:ring-navy resize-y"
            />
            <img src={asset('images/contact/icon-notches.svg')} alt="" className="absolute bottom-1 right-1 size-3 pointer-events-none" />
          </div>
        </div>

        {status === 'error' && (
          <p className="font-body font-normal text-body-sm text-red-600 w-full">
            Something went wrong sending your message. Please try again or email us directly.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-navy text-background hover:bg-background hover:text-navy flex gap-3 items-center justify-center rounded-lg border-2 border-transparent hover:border-navy transition-colors duration-300 px-5 py-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="font-body font-medium text-body-md whitespace-nowrap">
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </span>
        </button>
      </form>
    </section>
  );
}
