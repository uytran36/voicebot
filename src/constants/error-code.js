const errorCode = {
  1000: {
    eng: 'User without tenant_id !!!',
    vie: 'Người dùng không có tenant_id !!!',
  },

  1001: {
    eng: 'Token is undefined',
    vie: 'phiên đăng nhập hết hạn',
  },

  1002: {
    eng: 'User not found',
    vie: 'Không tìm thấy người dùng',
  },

  1003: {
    eng: 'Inactive user',
    vie: 'Tài khoản không hoạt động',
  },

  1000: {
    eng: 'User without tenant_id !!!',
    vie: 'Người dùng không có tenant_id !!!',
  },

  1004: {
    eng: 'No matching search results',
    vie: 'Không có kết quả phù hợp',
  },

  1005: {
    eng: 'Role not found',
    vie: 'Không tìm thấy vai trò',
  },

  1006: {
    eng: 'Please wait 10 seconds to upload a new image !!!',
    vie: 'Xin chờ 10 giây để tải lên ảnh mới !!!',
  },

  1007: {
    eng: 'Error the file must be in the format png or jpg !!!',
    vie: 'Chỉ cho phép định dạng png hoặc jpg !!!',
  },

  1008: {
    eng: 'list user is not None!!!',
    vie: 'Danh sách user không được để rỗng!',
  },

  1009: {
    eng: 'Update status user fail: %s',
    vie: 'Cập nhật trạng thái người dùng thất bại',
  },

  1010: {
    eng: '{id} is not ObjectID, it must be a 12-byte input or a 24-character hex string',
    vie: '{id} không phải ObjectID, yêu cầu đầu vào 12 byte hoặc chuỗi hex 24 ký tự',
  },

  1000: {
    eng: 'User without tenant_id !!!',
    vie: 'Người dùng không có tenant_id !!!',
  },

  1004: {
    eng: 'No matching search results',
    vie: 'Không có kết quả phù hợp',
  },

  2000: {
    eng: 'Role already exist !!!',
    vie: 'Vai trò đã tồn tại !!!',
  },

  2001: {
    eng: 'Role is not already exists !!!',
    vie: 'Vai trò chưa tồn tại !!!',
  },

  2002: {
    eng: 'New role name is already exists !!!',
    vie: 'Tên vai trò đã tồn tại !!!',
  },

  2003: {
    eng: 'List role id cannot be empty!!!',
    vie: 'Danh sách vai trò không được để trống !!!',
  },

  2004: {
    eng: 'Permission is not already exists !!!',
    vie: 'Phân quyền chưa tồn tại !!!',
  },

  1010: {
    eng: '{id} it must be a 12-byte input or a 24-character hex string',
    vie: '{id} yêu cầu đầu vào 12 byte hoặc chuỗi hex 24 ký tự',
  },

  2005: {
    eng: 'current | size pagination must be an instance of int',
    vie: 'số trang phải là số nguyên',
  },

  2006: {
    eng: 'current | size pagination must >= 1',
    vie: 'số trang phải >=1',
  },

  2001: {
    eng: 'Role is not already exists !!!',
    vie: 'Vai trò chưa tồn tại !!!',
  },

  2007: {
    eng: 'User is not mappign any role!!!',
    vie: 'user chưa được map với quyền !!!',
  },

  1010: {
    eng: '{v} ObjectId, it must be a 12-byte input or a 24-character hex string',
    vie: '{v} không phải ObjectID, yêu cầu đầu vào 12 byte hoặc chuỗi hex 24 ký tự',
  },

  2005: {
    eng: 'current | size pagination must be an instance of int',
    vie: 'số trang phải là số nguyên',
  },

  2006: {
    eng: 'current | size pagination must >= 1',
    vie: 'số trang phải >=1',
  },

  3000: {
    eng: 'This strategy is not supported yet!!!',
    vie: 'Loại API này chưa được hỗ trợ !!!',
  },

  3001: {
    eng: 'call_data is not exist',
    vie: 'Dữ liệu gọi không tồn tại',
  },

  3002: {
    eng: 'configuration is not exist',
    vie: 'Cấu hình API không tồn tại',
  },

  1000: {
    eng: 'User without tenant_id !!!',
    vie: 'Người dùng không có tenant_id !!!',
  },

  3003: {
    eng: 'file name {name} already existed',
    vie: 'Tên file {name} đã tồn tại',
  },

  3004: {
    eng: 'list data delete error {list_delete_error}',
    vie: 'Xóa file excel thất bại {list_delete_error}',
  },

  3005: {
    eng: 'get exception {e}',
    vie: 'lỗi chung {e}',
  },

  3006: {
    eng: 'Uploaded file not found, upload file again',
    vie: 'Không tìm thấy file tải lên',
  },

  3007: {
    eng: 'Call data is not allow to save validated only',
    vie: 'phải kiểm tra dữ liệu gọi trước khi lưu',
  },

  3008: {
    eng: 'CallData Name is error, upload again with new name please',
    vie: 'Tên dữ liệu gọi bị lỗi',
  },

  3001: {
    eng: 'call data does not exist',
    vie: 'Dữ liệu gọi không tồn tại',
  },

  3009: {
    eng: 'Data is not allowed to download',
    vie: 'Dữ liệu này không cho phép tải về',
  },

  3010: {
    eng: '<h1>Not Found</h1>(nhớ)',
    vie: 'không tìm thấy file',
  },

  3011: {
    eng: '<h1>Permission denied</h1>',
    vie: 'Không có quyền tải file về',
  },

  3012: {
    eng: "This strategy '{configuration.strategy}' is not supported yet",
    vie: "Loại API '{configuration.strategy}' chưa được hỗ trợ",
  },

  3013: {
    eng: 'Name {has_configuration.name} already existed',
    vie: 'Tên API {has_configuration.name} đã tồn tại',
  },

  3014: {
    eng: 'created configuration {has_configuration.name} not success',
    vie: 'Cấu hình API {has_configuration.name} thất bại',
  },

  3002: {
    eng: 'configuration is not exits',
    vie: 'Cấu hình API không tồn tại',
  },

  3015: {
    eng: 'New name of configuration already exists!!!',
    vie: 'Tên cấu hình API đã tồn tại !!!',
  },

  3016: {
    eng: "You can't delete the configuration because it is in use",
    vie: 'Cấu hình này đang được sử dụng',
  },

  1004: {
    eng: 'No matching search results',
    vie: 'Không có kết quả phù hợp',
  },

  3017: {
    eng: 'field must be string or empty',
    vie: 'Trường này yêu cầu dạng string hoặc để trống',
  },

  3018: {
    eng: 'from | to datetime must be datetime string',
    vie: "Thời gian 'từ'|'đến' yêu cầu dạng thời gian string",
  },

  3019: {
    eng: 'from | to datetime must be in ISO format string - example 2022-01-13T07:37:45.140Z',
    vie: "Thời gian 'từ'|'đến' yêu cầu dạng ISO string - VD: 2022-01-13T07:37:45.140Z",
  },

  3020: {
    eng: 'from_datetime is greater than to_datetime',
    vie: "Thời gian 'từ' phải nhỏ hơn thời gian 'đến'",
  },

  2005: {
    eng: 'current | size pagination must be an instance of int',
    vie: 'số trang phải là số nguyên',
  },

  2006: {
    eng: 'current | size pagination must >= 1',
    vie: 'số trang phải >=1',
  },

  3021: {
    eng: 'data type must be an instance of string',
    vie: 'chỉ được truyền dạng string',
  },

  3022: {
    eng: 'data_type "{v}" is not supported, must in [ all | excel | api ]',
    vie: 'Không hỗ trợ loại dữ liệu "{v}", chỉ hỗ trợ [ all | excel | api ]',
  },

  3023: {
    eng: 'call_data_ids must be an array of string',
    vie: 'chỉ được truyền dạng string',
  },

  3024: {
    eng: 'call_data_ids is empty',
    vie: 'ID dữ liệu gọi đang trống',
  },

  3025: {
    eng: 'Url field wrong format',
    vie: 'Trường URL sai định dạng',
  },

  3026: {
    eng: "method field must be 'GET' or 'POST'",
    vie: "trường method phải là 'GET' hoặc 'POST'",
  },

  3027: {
    eng: 'field mapping must be an dictionary',
    vie: 'sai định dạng trường',
  },

  3028: {
    eng: "required '{key_mapping}' field in mapping",
    vie: "thiếu trường '{key_mapping}'",
  },

  1010: {
    eng: 'ObjectId {v}, it must be a 12-byte input or a 24-character hex string',
    vie: 'ObjectID {v}, yêu cầu đầu vào 12 byte hoặc chuỗi hex 24 ký tự',
  },

  2005: {
    eng: 'current | size pagination must be an instance of int',
    vie: 'số trang phải là số nguyên',
  },

  1000: {
    eng: 'User without tenant_id !!!',
    vie: 'Người dùng không có tenant_id !!!',
  },

  4000: {
    eng: 'Campaign id is not already exist!!!',
    vie: 'Chiến dịch ID chưa tồn tại !!!',
  },

  4001: {
    eng: 'Create script is not success !!!',
    vie: 'Tạo kịch bản thất bại !!!',
  },

  4002: {
    eng: "Only when the campaign has a 'new' status or 'not_running' can it be updated.",
    vie: "Chỉ thực hiện được đối với chiến dịch 'chưa hoàn thất' hoặc 'chưa chạy'",
  },

  4003: {
    eng: 'CampaignScriptMapping is not already exist!!!',
    vie: 'Mapping kịch bản chưa tồn tại !!!',
  },

  4004: {
    eng: 'Campaign script is not already exist!!!',
    vie: 'Kịch bản chưa tồn tại !!!',
  },

  4005: {
    eng: 'Mapping script is not already exist!!!',
    vie: 'Kịch bản được mapping chưa tồn tại !!!',
  },

  4006: {
    eng: 'Campaign script is empty !!!',
    vie: 'Kịch bản đang trống !!!',
  },

  4007: {
    eng: 'Sample script is empty !!!',
    vie: 'Kịch bản mẫu đang trống !!!',
  },

  4008: {
    eng: 'This audio file does not exist',
    vie: 'File âm thanh không tồn tại',
  },

  4009: {
    eng: 'This file path does not exist',
    vie: 'Đường dẫn không tồn tại ',
  },

  4010: {
    eng: 'Sample script is exist !!!',
    vie: 'Kịch bản mẫu đang tồn tại !!!',
  },

  4011: {
    eng: 'Sample script is not already exist !!!',
    vie: 'Kịch bản mẫu chưa tồn tại !!!',
  },

  4012: {
    eng: 'Got error File data is {extension} change mp3',
    vie: 'File dữ liệu {extension} phải là mp3',
  },

  4013: {
    eng: "Got error content_type data is {extension} change 'audio/mp3' or 'audio/mpeg'",
    vie: "Nội dung {extension} phải là 'audio/mp3' hoặc 'audio/mpeg'",
  },

  4014: {
    eng: 'Get file TTS error, status_code from FPT AI {response.status_code}!!!',
    vie: 'Lỗi TTS từ FPT AI {response.status_code}!!!',
  },

  4015: {
    eng: 'Max retry get link tts!!!',
    vie: 'Vui lòng thử lại !!!',
  },

  1010: {
    eng: 'ObjectId {v}, it must be a 12-byte input or a 24-character hex string',
    vie: 'ObjectID {v}, yêu cầu đầu vào 12 byte hoặc chuỗi hex 24 ký tự',
  },

  1000: {
    eng: 'User without tenant_id !!!',
    vie: 'Người dùng không có tenant_id !!!',
  },

  1004: {
    eng: 'No matching search results',
    vie: 'Không có kết quả phù hợp',
  },

  5000: {
    eng: 'Campaign is not already exists !!!',
    vie: 'Chiến dịch chưa tồn tại !!!',
  },

  5001: {
    eng: 'Campaign_id cannot be empty !!!',
    vie: 'ID chiến dịch không được để trống !!!',
  },

  5002: {
    eng: 'raise ErrorResponseException("%s !!!" % e)',
    vie: 'lỗi chung',
  },

  5003: {
    eng: 'Call Data is not already exists !!!',
    vie: 'Dữ liệu gọi chưa tồn tại !!!',
  },

  5004: {
    eng: 'Call data api is not exist !!!',
    vie: 'Dữ liệu gọi API không tồn tại !!!',
  },

  5003: {
    eng: 'Call Data is not already exists !!!',
    vie: 'Dữ liệu gọi chưa tồn tại !!!',
  },

  5005: {
    eng: 'New Campaign is already exists !!!',
    vie: 'Chiến dịch mới đã tồn tại !!!',
  },

  5006: {
    eng: 'Data type must be api or excel !!!',
    vie: 'Loại dữ liệu phải là API hoặc excel !!!',
  },

  5000: {
    eng: 'Campaign is not exists !!!',
    vie: 'Chiến dịch chưa tồn tại !!!',
  },

  5007: {
    eng: "Campaign can't have the same name !!!",
    vie: 'Tên chiến dịch không được trùng !!!',
  },

  3001: {
    eng: 'call_data is not exists !!!',
    vie: 'Dữ liệu gọi không tồn tại !!!',
  },

  4002: {
    eng: "Only when the campaign has a 'new' status or 'not_running' can it be updated.",
    vie: "Chỉ thực hiện được đối với chiến dịch 'chưa chạy' hoặc 'chưa hoàn tất'",
  },

  5008: {
    eng: 'The new name of the campaign already exists!!!',
    vie: 'Tên chiến dịch đã tồn tại !!!',
  },

  5009: {
    eng: "Only while a campaign is 'new' or 'not_running' may delete it!!!",
    vie: "Chỉ được xóa các chiến dịch 'chưa hoàn tất' hoặc 'chưa chạy'",
  },

  5000: {
    eng: 'Campaign is not exists !!!',
    vie: 'Chiến dịch không tồn tại !!!',
  },

  5010: {
    eng: 'CampaignScriptMapping is not exists !!!',
    vie: 'Kịch bản không tồn tại !!!',
  },

  5011: {
    eng: 'CampaignCallData is not exists !!!',
    vie: 'Nội dung dữ liệu gọi không tồn tại !!!',
  },

  5001: {
    eng: 'Campaign_id cannot be empty !!!',
    vie: 'ID chiến dịch không được để trống !!!',
  },

  5012: {
    eng: 'campaign_id is not provided',
    vie: 'Chưa có ID chiến dịch',
  },

  5013: {
    eng: "Campaign_id can't be null !!!",
    vie: 'ID chiến dịch phải có giá trị !!!',
  },

  5014: {
    eng: "Status can't be null !!!",
    vie: 'Trạng thái không được để trống !!!',
  },

  5000: {
    eng: 'Campaign is not exist !!!',
    vie: 'Chiến dịch không tồn tại !!!',
  },

  5015: {
    eng: 'Only while a campaign is pending or running may change its status!!!',
    vie: "Chỉ thực hiện được đối với chiến dịch 'đang chay' hoặc 'tạm dừng'",
  },

  1010: {
    eng: 'ObjectId, it must be a 12-byte input or a 24-character hex string',
    vie: 'ObjectID, yêu cầu đầu vào 12 byte hoặc chuỗi hex 24 ký tự',
  },

  5016: {
    eng: "field data_type must be 'excel' or 'api'",
    vie: "Trường data_type phải là 'excel' hoặc 'API'",
  },

  2005: {
    eng: 'current | size pagination must be an instance of int',
    vie: 'số trang phải là số nguyên',
  },

  2006: {
    eng: 'current | size pagination must >= 1',
    vie: 'số trang phải >=1',
  },

  5017: {
    eng: 'field sort only 2 value: -1 (desc) or 1 (asc)',
    vie: 'lỗi khi FE trả sai giá trị',
  },

  5018: {
    eng: "stastus field is must be 'pending' or 'running' or 'stop'",
    vie: "trạng thái phải là 'đang chay', 'tạm dừng' hoặc 'kết thúc'",
  },

  6000: {
    eng: 'configuration not match with any call_data',
    vie: 'Cấu hình không phù hợp với dữ liệu gọi',
  },

  6001: {
    eng: 'field {mapping_key.get(field)} not found in call data',
    vie: 'Không tìm tháy trường {mapping_key.get(field)} trong dữ liệu gọi',
  },

  6002: {
    eng: 'List call_data get from API is empty.',
    vie: 'Danh sách dữ liệu gọi từ API đang trống',
  },

  6003: {
    eng: 'Call data is get from api empty',
    vie: 'Dữ liệu từ API bị rỗng',
  },

  6002: {
    eng: 'List call_data get from API is empty.',
    vie: 'Danh sách dữ liệu gọi từ API đang trống',
  },

  7000: {
    eng: 'Get field in call_data error',
    vie: 'Lỗi trường dữ liệu gọi',
  },

  3029: {
    eng: 'Field username, password must be required',
  },

  3030: {
    eng: 'configuration username, password must be required',
  },

  3031: {
    eng: 'url must be required',
  },

  4016: {
    eng: 'Get fields tts fail',
  },

  8000: {
    eng: 'field must be requested',
    vie: 'Thiếu trường ${field} truyền vào',
  },
};

export { errorCode };
