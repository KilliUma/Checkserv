import { useAuthStore } from '../stores/authStore'

export function Footer() {
  const { isAuthenticated } = useAuthStore()
  
  return (
    <footer className="bg-white text-gray-800">
      {/* Quick Links Section - Apenas para visitantes não autenticados */}
      {!isAuthenticated && (
        <div className="bg-white py-12 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">{/* French Version */}
            {/* French Version */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center hover:shadow-lg transition">
              <div className="mb-2">
                <img src="https://flagcdn.com/w80/fr.png" alt="French" className="w-16 h-12 mx-auto object-cover rounded" />
              </div>
              <h3 className="font-bold text-sm mb-1">CLICK BELOW</h3>
              <p className="text-xs text-gray-600 mb-2">FOR CHECKSERV</p>
              <p className="text-xs font-bold">IN FRENCH</p>
            </div>

            {/* Portuguese Version */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center hover:shadow-lg transition">
              <div className="mb-2">
                <img src="https://flagcdn.com/w80/pt.png" alt="Portuguese" className="w-16 h-12 mx-auto object-cover rounded" />
              </div>
              <h3 className="font-bold text-sm mb-1">CLICK BELOW</h3>
              <p className="text-xs text-gray-600 mb-2">FOR CHECKSERV</p>
              <p className="text-xs font-bold">IN PORTUGUESE</p>
            </div>

            {/* Company Profile */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center hover:shadow-lg transition">
              <div className="mb-2">
                <div className="w-16 h-12 mx-auto bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
              <h3 className="font-bold text-sm mb-1">Company Profile</h3>
              <p className="text-xs text-[#E91E63] font-semibold">Download PDF</p>
            </div>

            {/* Analysis Results App */}
            <div className="bg-[#8B0000] text-white rounded-lg p-4 text-center hover:shadow-lg transition">
              <h3 className="font-bold text-sm mb-2">ANALYSIS RESULTS</h3>
              <p className="text-xs mb-2">Get them for your lab results</p>
              <div className="flex justify-center gap-2 mt-3">
                <div className="text-xs">📱 App Store</div>
                <div className="text-xs">🤖 Google Play</div>
              </div>
            </div>

            {/* Subscribe */}
            <div className="bg-[#8B0000] text-white rounded-lg p-4 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-2">@</div>
              <h3 className="font-bold text-sm mb-1">SUBSCRIBE</h3>
              <p className="text-xs">JOIN OUR MAILING LIST</p>
            </div>

            {/* Speak Out */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">SPEAK OUT</h3>
              <div className="text-xs space-y-1">
                <p>• Whistle-blower</p>
                <p>• Corruption</p>
                <p>• Misconduct</p>
                <p>• Fraud</p>
                <p>• Harassment</p>
                <p>• Theft</p>
              </div>
            </div>
          </div>

          {/* Certification Logos */}
          <div className="flex justify-center items-center gap-12 py-8 border-t border-b border-gray-200">
            <div className="text-center">
              <div className="font-bold text-sm text-gray-700">SABS ISO 14001</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-gray-700">SANAS</div>
              <div className="text-xs text-gray-500">Testing Laboratory</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-gray-700">SABS ISO 9001</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Disclaimer Section */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <h3 className="font-bold text-gray-800 mb-4">DISCLAIMER</h3>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              As part of our POPIA system, our privacy policy is to inform you we may collect personal data from you when you submit information to us via our website, in compliance to the provisions 
              of the POPI Act we are informing you that we state and use your data for communication, specific offers, enquiries, quotations and information purposes as stored according to our strict 
              data protection policies.
            </p>
            <p>
              We will not share your Data with any other third parties or use your data for any purpose other than described above without your written consent. At any given time if you feel we have 
              violated your rights to the protection of your personal data You have a right to complain to us and we will take the necessary action, failing which you may escalate to the Regulators 
              offices.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>© 2020. CheckServ Africa - Leaders in Condition Monitoring. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Disclaimer</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition">Terms & Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <span>|</span>
              <a href="mailto:marketing@wearcheck.co.za?subject=Join Mailing List" className="hover:text-white transition">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
