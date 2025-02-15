import React from 'react';
import { useState } from 'react';
import '../../../styles/Profile.css';
import { useSelector} from 'react-redux';
import { ProfileUpdate } from '../../../preseneter/DashBoard/Profile';

const PersonalDetail = () => {
  const auth = useSelector((state) => state.auth.authData);
  const error = useSelector((state) => state.auth.authError);
  let userData = auth?.user;
  const [selectedImages, setSelectedImages] = useState([]);

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });

    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    
    // FOR BUG IN CHROME
    event.target.value = '';
  };
  const [loader, setLoader] = useState(false);
  const [validateDisabled, setValidateDisabled] = useState(false);
  const [inputs, setInputs] = useState({});
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateData();
  };
  const updateData = async () => {
  
    try {
      setValidateDisabled(true);
      setLoader(true);
      await ProfileUpdate(userData.id,inputs,auth.token)
      setLoader(false);
      setValidateDisabled(false);
     
    } catch (error) {
      alert('Error Updating Data');
    }
  };
  return (
    <form>
      <div className="text-[#626262] grid grid-cols-3 gap-5 mt-10 shadow-lg rounded-lg bg-white mx-10 pt-10">
        <div className="col-span-3 md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col">
          <div className="flex justify-center">
            <section>
              <label className="text-sm truncate px-2">
                Upload Your Photo  <br />
                <input
                  className="hidden"
                  type="file"
                  name="images"
                  onChange={onSelectFile}
                  multiple
                  accept="image/png , image/jpeg, image/webp"
                />
<img src={userData.profilePic} />
              </label>
              <br />
                
              {/* <input className="hidden" type="file" multiple /> */}

              {/* {selectedImages.length > 0 &&
                (selectedImages.length > 10 ? (
                  <p className="error">
                    You can't upload more than 10 images! <br />
                    <span>
                      please delete <b> {selectedImages.length - 10} </b> of
                      them{' '}
                    </span>
                  </p>
                ) : (
                  <button
                    className="upload-btn"
                    onClick={() => {
                      console.log(selectedImages);
                    }}
                  >
                    UPLOAD {selectedImages.length} IMAGE
                    {selectedImages.length === 1 ? '' : 'S'}
                  </button>
                ))}

              <div className="images">
                {selectedImages &&
                  selectedImages.map((image, index) => {
                    return (
                      <div key={image} className="image">
                        <img src={image} height="200" alt="upload" />
                        <button onClick={() => deleteHandler(image)}>
                          delete image
                        </button>
                        <p>{index + 1}</p>
                      </div>
                    );
                  })}
              </div> */}
            </section>
          </div>
          {/* <div className="mx-32 sm:mx-52 md:mx-16  mt-5 border-4 border-transparent border-t-gray-500"></div> */}
          {/* <div className="my-4 flex justify-center">
            <div className="hover:bg-[#7468ef] cursor-pointer hover:bg-opacity-10 px-5 py-3 border border-[#7468ef] rounded-md">
              <BsUpload className="h-5 w-5 " />
            </div>
          </div> */}
        </div>
        <div className="px-7 col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 flex flex-col">
          <div className="mt-5 flex flex-col">
            <div className="text-xs">Full Name</div>
            <div className=" border-gray-200 border rounded-md">
              <input
                name="name"
                value={inputs.name || userData?.name}
                onChange={handleChange}
                className="py-1 pl-3 w-full outline-none"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col">
            <div className="text-xs">E-mail</div>
            <div className=" border-gray-200 border rounded-md">
              <input
                name="email"
                value={inputs.email || userData?.email}
                onChange={handleChange}
                className="py-1 pl-3 w-full outline-none"
              />
            </div>
          </div>
          
          <div className="my-5 flex flex-col">
            <div className="text-xs">Gender</div>
            <div className="border rounded-md border-gray-200 ">
              <select
                value={inputs.gender || userData?.gender}
                name="gender"
                onChange={handleChange}
                className="py-1.5 pl-3 w-full outline-none"
              >
                <option className="outline-none">{userData?.gender}</option>
                <option className="outline-none">Male</option>
                <option className="outline-none">Female</option>
                <option className="outline-none">Other</option>
              </select>
            </div>
          </div>

          <div className="my-5 flex flex-col">
            <div className="text-xs">City</div>
            <div className="border rounded-md border-gray-200 ">
              <select
                value={inputs.city || userData?.city}
                name="city"
                onChange={handleChange}
                className="py-1.5 pl-3 w-full outline-none"
              >
                <option className="outline-none">{userData?.city}</option>
                <option className="outline-none">Banglore</option>
                <option className="outline-none">Delhi</option>
                <option className="outline-none">Gurgaon</option>
              </select>
            </div>
          </div>
          {error.show &&  (
          <div className="mt-2 text-[#da232aff] text-sm">
            {error.error}
          </div>
        )}
          <div className="mb-10 flex justify-end">
            <div
              className={`${
                validateDisabled ? 'opacity-75' : ''
              } cursor-pointer hover:shadow-lg bg-[#7367f0] text-white rounded-md px-7 py-1.5 mx-1`}
              onClick={(e) => handleUpdate(e)}
              disabled={validateDisabled}
            >
              {loader ? <span className="buttonloader"></span> : 'Save Changes'}
            </div>
            <div className="cursor-pointer hover:shadow-lg text-[#ff9f43] border border-[#ff9f43] rounded-md px-10 py-1.5 mx-1">
              Cancel
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonalDetail;
