import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Satellite,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    Swal.fire({
      title: "สำเร็จ",
      text: "ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด",
      icon: "success",
      confirmButtonText: "ตกลง",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      {/* Footer: Official Style with Contact Form (Merged) */}
      <footer
        id="contact"
        className="bg-gray-900 text-white border-t border-gray-800 pt-16 pb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Info */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Satellite className="w-6 h-6 text-primary-500" />
                <span className="font-display font-bold text-2xl">GROVI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
                ระบบติดตามสถานการณ์พืชผลทางการเกษตรด้วยเทคโนโลยีภูมิสารสนเทศ
                สนับสนุนการตัดสินใจเพื่อความมั่นคงทางอาหารและการพัฒนาที่ยั่งยืน
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-sky-500 transition"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-red-600 transition"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Contact Info (From Screenshot) */}
            <div className="col-span-1 lg:col-span-1">
              <h4 className="font-bold text-gray-200 mb-4 uppercase text-xs tracking-wider">
                ข้อมูลการติดต่อ
              </h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-primary-500" />
                  <span>
                    คณะสังคมศาสตร์ มหาวิทยาลัยเชียงใหม่
                    <br />
                    ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary-500" />
                  <span>061-657-0338</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <span>grovi@agri.com</span>
                </li>
              </ul>
            </div>

            {/* Contact Form (Integrated) */}
            <div className="col-span-1 lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-500" />{" "}
                ส่งข้อความถึงเรา
              </h4>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="ชื่อ-นามสกุล"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:border-primary-500 text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="อีเมล"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="หัวข้อ"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:border-primary-500 text-sm"
                />
                <textarea
                  rows={3}
                  name="message"
                  placeholder="ข้อความ"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:border-primary-500 text-sm"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded text-sm font-bold w-full transition"
                >
                  ส่งข้อความ
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
            <p>
              &copy; 2025 Grovi Geo-Informatics Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                เงื่อนไขการใช้งาน
              </a>
              <a href="#" className="hover:text-white">
                นโยบายความเป็นส่วนตัว
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactPage;
