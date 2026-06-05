import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaFileUpload, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaHourglassHalf, 
  FaTimesCircle,
  FaFileAlt,
  FaIdCard,
  FaArrowRight
} from 'react-icons/fa';
import { API_BASE_URL } from '../../api/config';

const KYCVerification = () => {
  const [kycStatus, setKycStatus] = useState('Not Submitted');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    gstNumber: '',
    businessRegistrationNumber: '',
    aadharNumber: '',
    panNumber: '',
    gstDoc: null,
    businessRegDoc: null,
    aadharDoc: null,
    panDoc: null,
    businessMobile: '',
    businessMobileDoc: null
  });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/partner/kyc-status`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setKycStatus(data.status);
        setProfile(data.profile);
        if (data.profile) {
           setFormData({
             gstNumber: data.profile.gstNumber || '',
             businessRegistrationNumber: data.profile.businessRegistrationNumber || '',
             aadharNumber: data.profile.aadharNumber || '',
             panNumber: data.profile.panNumber || '',
             gstDoc: null,
             businessRegDoc: null,
             aadharDoc: null,
             panDoc: null
           });
        }
      }
    } catch (err) {
      console.error("Fetch KYC status error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('gstNumber', formData.gstNumber);
      data.append('businessRegistrationNumber', formData.businessRegistrationNumber);
      data.append('aadharNumber', formData.aadharNumber);
      data.append('panNumber', formData.panNumber);
      data.append('businessMobile', formData.businessMobile);
      
      if (formData.gstDoc) {
        data.append('gstDoc', formData.gstDoc);
      } else {
        data.append('gstDoc', profile?.gstDoc || '');
      }

      if (formData.businessRegDoc) {
        data.append('businessRegDoc', formData.businessRegDoc);
      } else {
        data.append('businessRegDoc', profile?.businessRegDoc || '');
      }

      if (formData.aadharDoc) {
        data.append('aadharDoc', formData.aadharDoc);
      } else {
        data.append('aadharDoc', profile?.aadharDoc || '');
      }

      if (formData.panDoc) {
        data.append('panDoc', formData.panDoc);
      } else {
        data.append('panDoc', profile?.panDoc || '');
      }

      if (formData.businessMobileDoc) {
        data.append('businessMobileDoc', formData.businessMobileDoc);
      } else {
        data.append('businessMobileDoc', profile?.businessMobileDoc || '');
      }

      const res = await fetch(`${API_BASE_URL}/partner/kyc`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });

      const resData = await res.json();
      if (resData.success) {
        alert("KYC documents submitted successfully! 🚀");
        fetchStatus();
      } else {
        alert(resData.msg || "Submission failed");
      }
    } catch (err) {
      console.error("KYC Submission error:", err);
      alert("Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderStatusBadge = () => {
    switch (kycStatus) {
      case 'Verified':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-orange-600 rounded-full border border-orange-200">
            <FaCheckCircle />
            <span className="text-sm font-bold">Verified Partner</span>
          </div>
        );
      case 'Pending':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            <FaHourglassHalf className="animate-pulse" />
            <span className="text-sm font-bold">Verification Pending</span>
          </div>
        );
      case 'Rejected':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-200">
            <FaTimesCircle />
            <span className="text-sm font-bold">Verification Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-full border border-slate-200">
            <FaExclamationCircle />
            <span className="text-sm font-bold">Action Required</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FaShieldAlt className="text-[#1E3A8A]" />
            KYC Verification
          </h1>
          <p className="text-slate-500 font-medium mt-1">Submit your legal documents to unlock premium industrial leads.</p>
        </div>
        {renderStatusBadge()}
      </div>

      {kycStatus === 'Verified' ? (
        <div className="bg-white rounded-[40px] p-10 md:p-16 text-center border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          <div className="relative z-10 max-w-md mx-auto">
            <div className="w-24 h-24 bg-blue-100 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FaCheckCircle className="text-5xl" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">You're All Set!</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Your business has been successfully verified. You now have full access to global industrial tenders and direct supplier leads.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Instructions Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1E3A8A] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FaFileAlt className="text-orange-300" />
                Guidelines
              </h3>
              <ul className="space-y-4">
                {[
                  'Ensure GST number matches documents',
                  'Upload clear, scanned PDF or JPG',
                  'Max file size: 5MB per document',
                  'Approval takes 24-48 hours'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-blue-50/80">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold">{i+1}</span>
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {kycStatus === 'Rejected' && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h4 className="text-red-700 font-bold text-sm mb-2 flex items-center gap-2">
                  <FaTimesCircle /> Reason for Rejection
                </h4>
                <p className="text-red-600/70 text-xs font-medium leading-relaxed">
                  The uploaded GST document was blurry and unreadable. Please re-upload a clear scanned copy of your certificate.
                </p>
              </div>
            )}
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* GST Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">GST Number</label>
                <div className="relative group">
                  <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input 
                    type="text" 
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all font-bold text-slate-800"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>

              {/* Registration Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Registration ID</label>
                <div className="relative group">
                  <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input 
                    type="text" 
                    placeholder="U12345DL2024PTC000"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all font-bold text-slate-800"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData({...formData, businessRegistrationNumber: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>

              {/* Aadhar Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Aadhar Number</label>
                <div className="relative group">
                  <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all font-bold text-slate-800"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* PAN Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">PAN Number</label>
                <div className="relative group">
                  <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input 
                    type="text" 
                    placeholder="ABCDE1234F"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all font-bold text-slate-800"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>

              {/* File Upload 1 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">GST Certificate</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="gstDoc"
                    name="gstDoc"
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={!profile?.gstDoc}
                  />
                  <label htmlFor="gstDoc" className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-200 rounded-[28px] hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                      <FaFileUpload />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">{formData.gstDoc ? formData.gstDoc.name : profile?.gstDoc ? 'GST Document Uploaded' : 'Upload GST PDF'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Click to browse files</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Upload 2 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Business License</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="businessRegDoc"
                    name="businessRegDoc"
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={!profile?.businessRegDoc}
                  />
                  <label htmlFor="businessRegDoc" className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-200 rounded-[28px] hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                      <FaFileUpload />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">{formData.businessRegDoc ? formData.businessRegDoc.name : profile?.businessRegDoc ? 'Reg. Document Uploaded' : 'Upload Reg. PDF'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Click to browse files</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Upload 3 (Aadhar) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Aadhar Card</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="aadharDoc"
                    name="aadharDoc"
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={!profile?.aadharDoc}
                  />
                  <label htmlFor="aadharDoc" className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-200 rounded-[28px] hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                      <FaFileUpload />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">{formData.aadharDoc ? formData.aadharDoc.name : profile?.aadharDoc ? 'Aadhar Uploaded' : 'Upload Aadhar PDF'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Click to browse files</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Upload 4 (PAN) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">PAN Card</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="panDoc"
                    name="panDoc"
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={!profile?.panDoc}
                  />
                  <label htmlFor="panDoc" className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-200 rounded-[28px] hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                      <FaFileUpload />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">{formData.panDoc ? formData.panDoc.name : profile?.panDoc ? 'PAN Uploaded' : 'Upload PAN PDF'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Click to browse files</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Business Mobile */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Business Mobile</label>
                <div className="relative group">
                  <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all font-bold text-slate-800"
                    value={formData.businessMobile}
                    onChange={(e) => setFormData({...formData, businessMobile: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Business Mobile Doc */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Business Mobile Bill</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="businessMobileDoc"
                    name="businessMobileDoc"
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={!profile?.businessMobileDoc}
                  />
                  <label htmlFor="businessMobileDoc" className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-200 rounded-[28px] hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                      <FaFileUpload />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">{formData.businessMobileDoc ? formData.businessMobileDoc.name : profile?.businessMobileDoc ? 'Mobile Bill Uploaded' : 'Upload Mobile Bill'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Click to browse files</p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <button 
              type="submit"
              disabled={submitting || kycStatus === 'Pending'}
              className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/10 hover:bg-[#1E40AF] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading Documents...</span>
                </>
              ) : (
                <>
                  {kycStatus === 'Rejected' ? 'Re-submit Documents' : 'Submit for Verification'}
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default KYCVerification;
