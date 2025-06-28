"use client";

import { useEffect, useState } from "react";
import { Theater } from "../page";
import { CircleCheck, CircleX, SquarePen } from "lucide-react";
import {
  SearchOwnerEmail,
  createTheater,
  checkPhoneNumber,
  checkEmail,
  checkAddress,
  editTheater,
} from "@/app/services/admin/theaterService";
import { Owner } from "../../users/owners/page";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";

interface TheaterFormProps {
  theater?: Theater | null;
  reload: () => void;
  setShowModal: (show: boolean) => void;
}

export default function TheaterForm({
  theater,
  reload,
  setShowModal,
}: TheaterFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [theaterState, setTheaterState] = useState(theater);
  const [form, setForm] = useState({
    id: theaterState?.id || 0,
    name: theaterState?.name || "",
    address: theaterState?.address || "",
    city: theaterState?.city || "",
    state: theaterState?.state || "",
    country: theaterState?.country || "",
    zipCode: theaterState?.zipCode || "",
    phoneNumber: theaterState?.phoneNumber || "",
    email: theaterState?.email || "",
    openingTime: theaterState?.openingTime || "",
    closingTime: theaterState?.closingTime || "",
    totalScreens: theaterState?.totalScreens || 1,
    theaterOwnerId: theaterState?.theaterOwner?.id || 0,
  });

  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownerOptions, setOwnerOptions] = useState<Owner[]>([]); // mảng 1 phần tử hoặc rỗng

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total_screens" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(form);
  };

  useEffect(() => {
    setEdit(false);
  }, [theater]);

  // Tự động điền thông tin chủ rạp khi mở form chỉnh sửa
  useEffect(() => {
    if (theater && theater.theaterOwner) {
      setOwnerSearch(theater.theaterOwner.user.email);
      // Tạo object Owner phù hợp với interface
      const ownerData: Owner = {
        id: theater.theaterOwner.id,
        user: {
          id: theater.theaterOwner.user.id,
          name: theater.theaterOwner.user.name,
          email: theater.theaterOwner.user.email,
          phoneNumber: theater.theaterOwner.user.phoneNumber,
          username: theater.theaterOwner.user.username,
          fullName: theater.theaterOwner.user.fullName,
          dateOfBirth: theater.theaterOwner.user.dateOfBirth,
          role: "THEATER_OWNER" as const,
          password: null,
        },
      };
      setOwnerOptions([ownerData]);
    } else {
      setOwnerSearch("");
      setOwnerOptions([]);
    }
  }, [theater]);

  useEffect(() => {
    if (ownerSearch.length < 2) {
      setOwnerOptions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await SearchOwnerEmail(ownerSearch);
        if (res && res.statusCode === 200 && res.data) {
          setOwnerOptions([res.data]);
          // Tự động set theaterOwnerId khi có kết quả
          setForm((prev) => ({
            ...prev,
            theaterOwnerId: res.data.id,
          }));
        } else {
          setOwnerOptions([]);
        }
      } catch {
        setOwnerOptions([]);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [ownerSearch]);

  const resetForm = () => {
    setForm({
      id: theaterState?.id || 0,
      name: theaterState?.name || "",
      address: theaterState?.address || "",
      city: theaterState?.city || "",
      state: theaterState?.state || "",
      country: theaterState?.country || "",
      zipCode: theaterState?.zipCode || "",
      phoneNumber: theaterState?.phoneNumber || "",
      email: theaterState?.email || "",
      openingTime: theaterState?.openingTime || "",
      closingTime: theaterState?.closingTime || "",
      totalScreens: theaterState?.totalScreens || 1,
      theaterOwnerId: theaterState?.theaterOwner?.id || 0,
    });
  };
  const handleCreateTheater = async () => {
    try {
      // Validate dữ liệu trước khi xử lý
      const isValid = await validateTheaterFormAsync(form, ownerOptions);
      if (!isValid) {
        return;
      }

      // Chuẩn bị dữ liệu để tạo rạp
      const theaterData = {
        name: form.name.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        zipCode: form.zipCode.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        totalScreens: Number(form.totalScreens),
        theaterOwnerId: form.theaterOwnerId,
        isActive: true,
      };

      // Gọi API tạo rạp
      const response = await createTheater(theaterData);

      if (response && response.statusCode === 200) {
        showSuccess("Tạo rạp thành công!");
        reload();
        setShowModal(false);
        setTheaterState(
          (prev) =>
            ({
              ...prev!,
              ...theaterData,
            } as Theater)
        );
      } else {
        return;
      }
    } catch (error) {
      showErrorMessage("Có lỗi xảy ra khi tạo rạp: " + error);
    }
  };

  const handleUpdateTheater = async () => {
    try {
      // Validate dữ liệu trước khi xử lý
      const isValid = await validateTheaterFormForUpdate(
        form,
        ownerOptions,
        theater!
      );
      if (!isValid) {
        return;
      }

      // Chuẩn bị dữ liệu để cập nhật rạp
      const theaterData = {
        name: form.name.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        zipCode: form.zipCode.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        totalScreens: Number(form.totalScreens),
        theaterOwnerId: form.theaterOwnerId,
      };

      // Gọi API cập nhật rạp
      const response = await editTheater(theaterData, form.id);

      if (response && response.statusCode === 200) {
        showSuccess("Cập nhật rạp thành công!");
        reload();
        setEdit(false);
        setTheaterState(
          (prev) =>
            ({
              ...prev!,
              ...theaterData,
            } as Theater)
        );
      } else {
        return;
      }
    } catch (error) {
      showErrorMessage("Có lỗi xảy ra khi cập nhật rạp: " + error);
    }
  };
  console.log("form owner", form.theaterOwnerId);
  function validateTheaterForm(form: Theater, ownerOptions: Owner[]): boolean {
    // Validate name
    if (!form.name || form.name.trim().length === 0) {
      showErrorMessage("Tên rạp không được để trống");
      return false;
    }
    // Validate address
    if (!form.address || form.address.trim().length === 0) {
      showErrorMessage("Địa chỉ không được để trống");
      return false;
    }
    // Validate city
    if (!form.city || form.city.trim().length === 0) {
      showErrorMessage("Quận/huyện không được để trống");
      return false;
    }
    // Validate state
    if (!form.state || form.state.trim().length === 0) {
      showErrorMessage("Tỉnh/Thành không được để trống");
      return false;
    }
    // Validate country
    if (!form.country || form.country.trim().length === 0) {
      showErrorMessage("Quốc gia không được để trống");
      return false;
    }
    // Validate zip_code
    if (!form.zipCode || form.zipCode.trim().length === 0) {
      showErrorMessage("Mã bưu chính không được để trống");
      return false;
    }
    // Validate phone_number
    if (!form.phoneNumber || form.phoneNumber.trim().length === 0) {
      showErrorMessage("Số điện thoại rạp không được để trống");
      return false;
    } else if (!/^0\d{9}$/.test(form.phoneNumber)) {
      showErrorMessage(
        "Số điện thoại rạp phải bắt đầu bằng số 0 và có đúng 10 chữ số!"
      );
      return false;
    }
    // Validate email
    if (!form.email || form.email.trim().length === 0) {
      showErrorMessage("Email rạp không được để trống");
      return false;
    } else if (!/^\S+@gmail\.com$/.test(form.email)) {
      showErrorMessage("Email rạp phải có dạng @gmail.com!");
      return false;
    }
    // Validate opening_time
    if (!form.openingTime || form.openingTime.trim().length === 0) {
      showErrorMessage("Giờ mở cửa không được để trống");
      return false;
    }
    // Validate closing_time
    if (!form.closingTime || form.closingTime.trim().length === 0) {
      showErrorMessage("Giờ đóng cửa không được để trống");
      return false;
    }
    // Validate thời gian mở cửa < đóng cửa
    if (form.openingTime >= form.closingTime) {
      showErrorMessage("Giờ mở cửa phải bé hơn giờ đóng cửa!");
      return false;
    }
    // Validate total_screens
    if (
      form.totalScreens === null ||
      form.totalScreens === undefined ||
      isNaN(Number(form.totalScreens))
    ) {
      showErrorMessage("Số phòng chiếu không được để trống và phải là số");
      return false;
    } else if (Number(form.totalScreens) <= 0) {
      showErrorMessage("Số phòng chiếu phải lớn hơn 0");
      return false;
    }
    // Validate owner
    if (!form.theaterOwnerId || form.theaterOwnerId === 0) {
      showErrorMessage("Vui lòng chọn chủ rạp hợp lệ!");
      return false;
    }
    return true;
  }

  async function validateTheaterFormAsync(
    form: Theater,
    ownerOptions: Owner[]
  ): Promise<boolean> {
    // Validate cơ bản trước
    if (!validateTheaterForm(form, ownerOptions)) {
      return false;
    }

    try {
      // Kiểm tra trùng lặp phone number
      const phoneCheck = await checkPhoneNumber(form.phoneNumber.trim());
      if (
        phoneCheck &&
        phoneCheck.statusCode === 200 &&
        phoneCheck.data === true
      ) {
        showErrorMessage("Số điện thoại rạp đã tồn tại trong hệ thống!");
        return false;
      }

      // Kiểm tra trùng lặp email
      const emailCheck = await checkEmail(form.email.trim());
      if (
        emailCheck &&
        emailCheck.statusCode === 200 &&
        emailCheck.data === true
      ) {
        showErrorMessage("Email rạp đã tồn tại trong hệ thống!");
        return false;
      }

      // Kiểm tra trùng lặp address
      const addressCheck = await checkAddress(
        form.address.trim(),
        form.theaterOwnerId
      );
      if (
        addressCheck &&
        addressCheck.statusCode === 200 &&
        addressCheck.data === true
      ) {
        showErrorMessage("Chủ rạp này đã có rạp tại địa chỉ đó!");
        return false;
      }

      return true;
    } catch (error) {
      showErrorMessage("Có lỗi xảy ra khi kiểm tra dữ liệu: " + error);
      return false;
    }
  }

  async function validateTheaterFormForUpdate(
    form: Theater,
    ownerOptions: Owner[],
    currentTheater: Theater
  ): Promise<boolean> {
    // Validate cơ bản trước
    if (!validateTheaterForm(form, ownerOptions)) {
      return false;
    }

    // Kiểm tra xem có tìm được chủ rạp mới không (nếu đã nhập email tìm kiếm)
    if (ownerSearch && ownerSearch.length >= 2 && ownerOptions.length === 0) {
      showErrorMessage("Không tìm thấy chủ rạp với email đã nhập!");
      return false;
    }

    // Kiểm tra xem chủ rạp có thay đổi không
    if (ownerSearch && ownerSearch.length >= 2 && ownerOptions.length > 0) {
      const newOwnerId = ownerOptions[0].id;
      if (newOwnerId !== currentTheater.theaterOwnerId) {
        // Nếu thay đổi chủ rạp, cập nhật theaterOwnerId
        setForm((prev) => ({
          ...prev,
          theaterOwnerId: newOwnerId,
        }));
      }
    }

    try {
      // Kiểm tra trùng lặp phone number (chỉ khi thay đổi)
      if (form.phoneNumber.trim() !== currentTheater.phoneNumber) {
        const phoneCheck = await checkPhoneNumber(form.phoneNumber.trim());
        if (
          phoneCheck &&
          phoneCheck.statusCode === 200 &&
          phoneCheck.data === true
        ) {
          showErrorMessage("Số điện thoại rạp đã tồn tại trong hệ thống!");
          return false;
        }
      }

      // Kiểm tra trùng lặp email (chỉ khi thay đổi)
      if (form.email.trim() !== currentTheater.email) {
        const emailCheck = await checkEmail(form.email.trim());
        if (
          emailCheck &&
          emailCheck.statusCode === 200 &&
          emailCheck.data === true
        ) {
          showErrorMessage("Email rạp đã tồn tại trong hệ thống!");
          return false;
        }
      }

      // Kiểm tra trùng lặp address (chỉ khi thay đổi)
      if (form.address.trim() !== currentTheater.address) {
        const addressCheck = await checkAddress(
          form.address.trim(),
          form.theaterOwnerId
        );
        if (
          addressCheck &&
          addressCheck.statusCode === 200 &&
          addressCheck.data === true
        ) {
          showErrorMessage("Chủ rạp này đã có rạp tại địa chỉ đó!");
          return false;
        }
      }

      return true;
    } catch (error) {
      showErrorMessage("Có lỗi xảy ra khi kiểm tra dữ liệu: " + error);
      return false;
    }
  }

  console.log("theaterState", theaterState);
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="name">
            Tên rạp
          </label>
          <input
            id="name"
            name="name"
            placeholder="Tên rạp"
            value={form.name}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="address">
            Địa chỉ
          </label>
          <input
            id="address"
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="state">
            Tỉnh/Thành
          </label>
          <input
            id="state"
            name="state"
            placeholder="Tỉnh/Thành"
            value={form.state}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="city">
            Quận/huyện
          </label>
          <input
            id="city"
            name="city"
            placeholder="Quận/huyện"
            value={form.city}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="country">
            Quốc gia
          </label>
          <input
            id="country"
            name="country"
            placeholder="Quốc gia"
            value={form.country}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="zipCode">
            Mã bưu chính
          </label>
          <input
            id="zipCode"
            name="zipCode"
            placeholder="Mã bưu chính"
            value={form.zipCode}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="phoneNumber">
            Số điện thoại
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="openingTime">
            Giờ mở cửa
          </label>
          <input
            id="openingTime"
            name="openingTime"
            type="time"
            value={form.openingTime}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="closingTime">
            Giờ đóng cửa
          </label>
          <input
            id="closingTime"
            name="closingTime"
            type="time"
            value={form.closingTime}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="totalScreens">
            Số phòng chiếu
          </label>
          <input
            id="totalScreens"
            name="totalScreens"
            type="number"
            placeholder="Số phòng chiếu"
            value={form.totalScreens}
            onChange={handleChange}
            min={1}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="ownerId">
            Chủ rạp
          </label>
          <div className="w-[80%] relative">
            <input
              type="text"
              placeholder="Tìm kiếm chủ rạp theo email..."
              value={ownerSearch}
              onChange={(e) => setOwnerSearch(e.target.value)}
              className="border px-2 py-1.5 rounded-[8px] text-[15px] w-full pr-8"
              autoComplete="off"
            />
            {ownerSearch && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xl">
                {ownerOptions.length > 0 ? (
                  <CircleCheck className="text-green-500" size={18} />
                ) : (
                  <CircleX className="text-red-500" size={18} />
                )}
              </span>
            )}
          </div>
        </div>

        {theater && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center  bg-[#CCC6F4] cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} className="" />
            </div>
          </div>
        )}

        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="submit"
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => {
                setEdit(false);
                resetForm();
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleUpdateTheater}
            >
              Xác nhận
            </button>
          </div>
        )}
        {theater === null && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleCreateTheater}
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
