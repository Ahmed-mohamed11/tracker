import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormText from "../../components/form/FormText";
import FormNumber from "./../../components/form/FormNumber";
import { useI18nContext } from "../../context/i18n-context";
import FormSelect from "./../../components/form/FormSelect";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

const AddSites = ({ closeModal, open, fetchData }) => {
  const [formData, setFormData] = useState({
    ar_name: "",
    en_name: "",
    max_distance: 0,
    latitude: 0,
    longitude: 0,
    branch: 0,
  });

  const [isFormDataReady, setIsFormDataReady] = useState(false);
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [branchesList, setBranchesList] = useState([]);
  const mapRef = useRef();

  const fetchBranches = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("لم يتم العثور على الرمز في الكوكيز");
        return;
      }

      const response = await axios.get(
        "https://bio.skyrsys.com/api/working-hours/branchs-list/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const transformedOptions = response.data.map((branch) => ({
        label: branch.branch_name,
        value: branch.id,
      }));

      setBranchesList(transformedOptions);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const extractLatLng = useCallback(() => {
    const match = googleMapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      setFormData((prevData) => ({
        ...prevData,
        latitude: lat,
        longitude: lng,
      }));

      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 10);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        latitude: 0,
        longitude: 0,
      }));
      setGoogleMapLink("");
      toast.error("يرجى وضع لينك موقع صالح", { pauseOnHover: false });
    }
  }, [googleMapLink]);

  useEffect(() => {
    if (
      formData.latitude !== 0 &&
      formData.longitude !== 0 &&
      googleMapLink !== ""
    ) {
      setIsFormDataReady(true);
    } else {
      setIsFormDataReady(false);
    }
  }, [formData, googleMapLink]);

  useEffect(() => {
    if (open && formData.latitude && formData.longitude && mapRef.current) {
      mapRef.current.flyTo([formData.latitude, formData.longitude], 8);
    }
  }, [open, formData.latitude, formData.longitude]);

  const { t } = useI18nContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.ar_name ||
      !formData.en_name ||
      !formData.branch ||
      !googleMapLink
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة", { pauseOnHover: false });
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.post(
        "https://bio.skyrsys.com/api/company/location/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const newLocation = response.data;
      console.log("Location added successfully:", newLocation);

      setFormData({
        ar_name: "",
        en_name: "",
        max_distance: 0,
        latitude: 0,
        longitude: 0,
        branch: 0,
      });
      setGoogleMapLink("");

      toast.success("تم الإنشاء بنجاح", { pauseOnHover: false });

      fetchData();
      closeModal();
    } catch (error) {
      console.error(
        "Error adding location:",
        error.response?.data || error.message
      );
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prevData) => ({
          ...prevData,
          latitude: lat,
          longitude: lng,
        }));
        map.setView([lat, lng], map.getZoom());
      },
    });
    return null;
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      id="createStudent"
      className={`createStudent overflow-y-auto overflow-x-hidden duration-200 ease-linear
                shadow-2xl shadow-slate-500 
                backdrop-blur-sm backdrop-saturate-[180%]
                dark:shadow-white/[0.10] dark:backdrop-blur-sm dark:backdrop-saturate-[180%] 
                fixed top-0 left-0 z-50 justify-center items-center
                w-full h-full ${open ? "visible" : "invisible"}`}
    >
      <div
        style={{ boxShadow: "black 19px 0px 45px -12px" }}
        className={`rounded-l-[15px] p-4 w-full h-fit max-w-[50rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${open
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : "absolute top-1/2 -left-full -translate-x-1/2 -translate-y-1/2"
          }
                overflow-auto`}
        dir="rtl"
      >
        <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10 ">
            <h2>اضافه مجموعه مواقع جديده</h2>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X size={18} weight="bold" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="main-content-wrap mt-5">
            <form
              className="form-add-product text-right flex flex-col gap-5"
              onSubmit={handleSubmit}
            >
              <div className="mb-5 grid justify-center grid-cols-1 md:grid-cols-2 gap-4 ">
                <FormText
                  label="الاسم بالعربي"
                  name="ar_name"
                  placeholder="الاسم بالعربي"
                  value={formData.ar_name}
                  onChange={handleChange}
                />
                <FormText
                  label="الاسم بالانجليزي"
                  placeholder="الاسم بالانجليزي"
                  name="en_name"
                  value={formData.en_name}
                  onChange={handleChange}
                />
                <FormSelect
                  label="الفرع"
                  name="branch"
                  options={branchesList}
                  onChange={handleChange}
                  value={formData.plan_id}
                />
                <FormNumber
                  label="اقصى مسافة"
                  placeholder="اقصى مسافة"
                  name="max_distance"
                  value={formData.max_distance}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <FormText
                label="رابط جوجل ماب"
                name="googleMapLink"
                placeholder="ادخل رابط جوجل ماب"
                value={googleMapLink}
                onChange={(e) => setGoogleMapLink(e.target.value)}
                onBlur={extractLatLng}
              />
              {open && isFormDataReady && (
                <MapContainer
                  center={[formData.latitude, formData.longitude]}
                  zoom={8}
                  style={{ height: "300px", width: "100%" }}
                  whenCreated={(map) => (mapRef.current = map)}
                >
                  <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                  <MapEvents />

                  {formData.latitude && formData.longitude && (
                    <Marker position={[formData.latitude, formData.longitude]}>
                      <Popup>
                        Current location:{" "}
                        <pre>
                          {JSON.stringify(
                            { lat: formData.latitude, lng: formData.longitude },
                            null,
                            2
                          )}
                        </pre>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}

              <button
                className="w-1/2 mx-auto text-center border-2 justify-center
                  text-themeColor-700 px-4 py-2 rounded-md bg-white
                 duration-150 ease-linear hover:translate-y-[-0.25em]
                 hover:shadow-[0_0.5em_0.5em_-0.4em_#131a50] focus:shadow-[0_0.5em_0.5em_-0.4em_#131a50]
                 hover:text-white hover:bg-themeColor-700 border-themeColor-700 transition flex items-center"
                type="submit"
              >
                اضف
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSites;
