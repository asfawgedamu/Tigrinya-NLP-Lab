import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';
import { SocialBadges } from '../SocialBadges';
import { CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';

export const InteractiveContact: React.FC = () => {
  const { isDark } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwwfQDJUBNhNqsEmHznlyPpj4p7s4fdKAGuNITupCKZPkG31pMLXzD-KPA33cOHw4yZ/exec';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Spam honeypot trap

    setIsSubmitting(true);
    setSubmittedStatus('idle');

    try {
      const params = new URLSearchParams({
        first_name: firstName,
        last_name: lastName,
        email: email,
        subject: subject || 'Portfolio Inquiry for Asfaw Gedamu',
        message: message
      });

      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: params
      });

      setIsSubmitting(false);
      setSubmittedStatus('success');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setIsSubmitting(false);
      setSubmittedStatus('error');
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Top Hero Badges Bar */}
      <div className="pb-2">
        <SocialBadges />
      </div>

      {/* Main Section Card */}
      <section className={`p-6 sm:p-10 rounded-2xl border backdrop-blur-xl space-y-6 shadow-2xl transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/80 text-white' : 'border-slate-300 bg-white text-slate-900'
      }`}>
        <div>
          <div className="text-xs font-mono mb-1 text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Communication Channel</span>
          </div>
          <h1 className={`font-serif text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Get in touch
          </h1>
          <p className={`mt-2 text-sm sm:text-base max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            LinkedIn is the fastest way to reach me. The form below works directly for research collaboration on African-language NLP technology and enterprise training partnerships.
          </p>
        </div>

        {submittedStatus === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-3 text-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-white">Thank you! Your message has been sent successfully.</strong>
              It was dispatched directly to Asfaw&apos;s inbox via the secure Google Apps Script webhook.
            </div>
          </div>
        )}

        {submittedStatus === 'error' && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-white">Message delivery failed.</strong>
              Please use the direct Gmail button above or connect on LinkedIn.
            </div>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          {/* Honeypot field (hidden) */}
          <div className="hidden" aria-hidden="true">
            <label>
              Leave this empty
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          {/* First name & Last name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                First name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition shadow-inner ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                placeholder="Enter first name..."
              />
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Last name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition shadow-inner ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                placeholder="Enter last name..."
              />
            </div>
          </div>

          {/* Email row */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition shadow-inner ${
                isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="name@organization.com"
            />
          </div>

          {/* Subject row */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition shadow-inner ${
                isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="Research collaboration or training inquiry..."
            />
          </div>

          {/* Message row */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Message
            </label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full border rounded-xl p-3.5 text-sm focus:outline-none focus:border-cyan-400 transition leading-relaxed shadow-inner ${
                isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="Write your message or inquiry here..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition cursor-pointer disabled:opacity-50 shadow-lg shadow-cyan-400/20 hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </div>
        </form>
      </section>

    </div>
  );
};
