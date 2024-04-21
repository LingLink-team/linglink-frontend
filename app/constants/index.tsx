import { CourseCardProps } from "../[locale]/course/components/course";

export const courses: CourseCardProps[] = [
    {
        name: "English Speaking Mastery",
        student: 50,
        teacher: "John Doe",
        startTime: new Date("2024-03-01T09:00:00"),
        endTime: new Date("2024-03-01T11:00:00"),
        img: "https://mshoagiaotiep.com/uploads/images/userfiles/2020/08/lotrinhkhtructuyen.png",
        price: 4000000,
        downprice: 3000000,
        downrate: 25,
        teacher_genders: "female",
        descrip: "<p>Khóa học này tập trung vào việc phát triển kỹ năng giao tiếp tiếng Anh cho người học từ cơ bản đến nâng cao.</p>" +
            "<p>Học viên sẽ được đào tạo bởi đội ngũ giáo viên chuyên nghiệp, giàu kinh nghiệm và am hiểu sâu rộng về ngôn ngữ và văn hóa tiếng Anh.</p>" +
            "<p>Chương trình học linh hoạt, với nhiều hoạt động thực hành và tương tác, giúp học viên nắm vững kỹ năng ngôn ngữ và tự tin giao tiếp trong mọi tình huống.</p>",
        target: "<p>- Học viên muốn nâng cao kỹ năng giao tiếp tiếng Anh của mình từ cơ bản đến nâng cao.</p>" +
            "<p>- Các bạn muốn cải thiện khả năng nghe, nói, đọc, viết tiếng Anh một cách tự tin và thành thạo.</p>" +
            "<p>- Người học muốn thực hành và rèn luyện kỹ năng giao tiếp tiếng Anh trong môi trường học tập tích cực và thú vị.</p>",
        information: "<p>- Thời gian: 2 tháng</p>" +
            "<p>- Số buổi học: 20 buổi</p>" +
            "<p>- Lịch học: Thứ 2 - Thứ 4 - Thứ 6, từ 18:00 đến 20:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh ABC, 123 Nguyễn Du, Quận 1, TP.HCM</p>",
        contact: "<p>Để biết thêm thông tin chi tiết và đăng ký khóa học, vui lòng liên hệ:</p>" +
            "<p>- Hotline: 0123 456 789</p>" +
            "<p>- Email: info@englishspeakingmastery.com</p>" +
            "<p>- Website: www.englishspeakingmastery.com</p>",
        type: ["Speaking"]
    },
    {
        name: "English for Business Professionals",
        student: 30,
        teacher: "Jane Smith",
        startTime: new Date("2024-04-01T10:00:00"),
        endTime: new Date("2024-04-01T12:00:00"),
        img: "https://onthiielts.com.vn/wp-content/uploads/2023/04/khoa-hoc-tieng-anh-thuong-mai.jpg",
        price: 3500000,
        downprice: 3200000,
        downrate: 10,
        teacher_genders: "male",
        descrip: "<p>Khóa học này được thiết kế đặc biệt cho các chuyên gia kinh doanh muốn cải thiện kỹ năng giao tiếp tiếng Anh trong môi trường kinh doanh quốc tế.</p>",
        target: "<p>- Các doanh nhân, chuyên gia kinh doanh muốn nắm vững kỹ năng giao tiếp tiếng Anh trong công việc hàng ngày.</p>",
        information: "<p>- Thời gian: 3 tháng</p>" +
            "<p>- Số buổi học: 30 buổi</p>" +
            "<p>- Lịch học: Thứ 3 - Thứ 5, từ 19:00 đến 21:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh XYZ, 456 Nguyễn Văn Linh, Quận 5, TP.HCM</p>",
        contact: "<p>- Hotline: 0987 654 321</p>" +
            "<p>- Email: info@englishforbusiness.com</p>" +
            "<p>- Website: www.englishforbusiness.com</p>",
        type: ["Khác"]
    },
    {
        name: "IELTS Preparation Course",
        student: 20,
        teacher: "Emily Johnson",
        startTime: new Date("2024-05-01T14:00:00"),
        endTime: new Date("2024-05-01T16:00:00"),
        img: "https://res.edu.vn/wp-content/uploads/2021/11/cover-cac-khoa-hoc-tai-res-1400x533.jpg",
        price: 5000000,
        downprice: 4800000,
        downrate: 5,
        teacher_genders: "female",
        descrip: "<p>Khóa học này nhằm mục đích chuẩn bị học viên cho kỳ thi IELTS, giúp họ cải thiện kỹ năng nghe, nói, đọc và viết tiếng Anh một cách hiệu quả.</p>",
        target: "<p>- Các bạn muốn chuẩn bị kỳ thi IELTS với mục tiêu đạt điểm cao.</p>",
        information: "<p>- Thời gian: 2 tháng</p>" +
            "<p>- Số buổi học: 20 buổi</p>" +
            "<p>- Lịch học: Thứ 4 - Thứ 6, từ 17:00 đến 19:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh XYZ, 789 Lê Lợi, Quận 3, TP.HCM</p>",
        contact: "<p>- Hotline: 0901 234 567</p>" +
            "<p>- Email: info@ieltspreparation.com</p>" +
            "<p>- Website: www.ieltspreparation.com</p>",
        type: ["IELTS"]
    },
    {
        name: "English Conversation Club",
        student: 15,
        teacher: "Michael Brown",
        startTime: new Date("2024-06-01T18:30:00"),
        endTime: new Date("2024-06-01T20:30:00"),
        img: "https://weset.edu.vn/wp-content/uploads/2022/12/IELTS-TUTOR-v2-17.jpg",
        price: 3000000,
        downprice: 2800000,
        downrate: 10,
        teacher_genders: "male",
        descrip: "<p>English Conversation Club là nơi lý tưởng cho các bạn muốn thực hành kỹ năng giao tiếp tiếng Anh và gặp gỡ những người bạn mới từ khắp nơi trên thế giới.</p>",
        target: "<p>- Mọi người muốn nâng cao kỹ năng giao tiếp tiếng Anh thông qua các cuộc trò chuyện thú vị và ý nghĩa.</p>",
        information: "<p>- Thời gian: Hằng tuần</p>" +
            "<p>- Số buổi học: Không giới hạn</p>" +
            "<p>- Lịch học: Mỗi Thứ 7, từ 10:00 đến 12:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh ABC, 246 Trần Hưng Đạo, Quận 10, TP.HCM</p>",
        contact: "<p>- Hotline: 0978 987 654</p>" +
            "<p>- Email: info@englishconversationclub.com</p>" +
            "<p>- Website: www.englishconversationclub.com</p>",
        type: ["Khác"]
    },
    {
        name: "English for Kids",
        student: 10,
        teacher: "Emma Lee",
        startTime: new Date("2024-07-01T15:00:00"),
        endTime: new Date("2024-07-01T17:00:00"),
        img: "https://vnn-imgs-f.vgcloud.vn/2021/10/04/16/lo-trinh-cac-khoa-hoc-tai-he-thong-tieng-anh-tre-em-binggo-leaders.jpg",
        price: 2500000,
        downprice: 2300000,
        downrate: 8,
        teacher_genders: "female",
        descrip: "<p>Khóa học này được thiết kế dành riêng cho các em nhỏ từ 6 đến 12 tuổi, giúp chúng phát triển kỹ năng ngôn ngữ và tự tin giao tiếp tiếng Anh.</p>",
        target: "<p>- Các em nhỏ từ 6 đến 12 tuổi muốn bắt đầu học tiếng Anh một cách vui nhộn và hiệu quả.</p>",
        information: "<p>- Thời gian: 3 tháng</p>" +
            "<p>- Số buổi học: 30 buổi</p>" +
            "<p>- Lịch học: Thứ 3 - Thứ 5, từ 15:00 đến 17:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh ABC, 789 Lê Lợi, Quận 1, TP.HCM</p>",
        contact: "<p>- Hotline: 0932 345 678</p>" +
            "<p>- Email: info@englishforkids.com</p>" +
            "<p>- Website: www.englishforkids.com</p>",
        type: ["Trẻ em"]
    },
    {
        name: "TOEIC Preparation Course",
        student: 25,
        teacher: "David Wilson",
        startTime: new Date("2024-08-01T09:00:00"),
        endTime: new Date("2024-08-01T11:00:00"),
        img: "https://www.anhngumshoa.com/uploads/images/userfiles/khoa-hoc-basic-toeic-anh-ngu-msh-hoa.jpg",
        price: 4500000,
        downprice: 4200000,
        downrate: 7,
        teacher_genders: "male",
        descrip: "<p>Khóa học này nhằm mục đích giúp học viên chuẩn bị cho kỳ thi TOEIC, từ vựng phong phú, ngữ pháp chính xác và kỹ năng làm bài thi hiệu quả.</p>",
        target: "<p>- Những ai muốn cải thiện điểm số TOEIC của mình để mở cửa cho cơ hội việc làm tốt hơn.</p>",
        information: "<p>- Thời gian: 2 tháng</p>" +
            "<p>- Số buổi học: 20 buổi</p>" +
            "<p>- Lịch học: Thứ 2 - Thứ 4 - Thứ 6, từ 9:00 đến 11:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh XYZ, 123 Đường ABC, Quận 2, TP.HCM</p>",
        contact: "<p>- Hotline: 0945 678 901</p>" +
            "<p>- Email: info@toeicpreparation.com</p>" +
            "<p>- Website: www.toeicpreparation.com</p>",
        type: ["TOEIC"]
    },
    {
        name: "TOEFL Preparation Course",
        student: 20,
        teacher: "Sarah Johnson",
        startTime: new Date("2024-09-01T10:00:00"),
        endTime: new Date("2024-09-01T12:00:00"),
        img: "https://www.anhngumshoa.com/uploads/images/userfiles/2020/12/03/toefl.png",
        price: 5500000,
        downprice: 5200000,
        downrate: 5,
        teacher_genders: "female",
        descrip: "<p>Khóa học này nhằm mục đích giúp học viên chuẩn bị cho kỳ thi TOEFL, từ vựng, ngữ pháp và kỹ năng làm bài thi hiệu quả.</p>",
        target: "<p>- Những ai muốn học, làm việc hoặc sống ở nước nói tiếng Anh.</p>",
        information: "<p>- Thời gian: 3 tháng</p>" +
            "<p>- Số buổi học: 30 buổi</p>" +
            "<p>- Lịch học: Thứ 3 - Thứ 5, từ 10:00 đến 12:00</p>" +
            "<p>- Địa điểm: Trung tâm Tiếng Anh ABC, 456 Nguyễn Văn Linh, Quận 7, TP.HCM</p>",
        contact: "<p>- Hotline: 0912 345 678</p>" +
            "<p>- Email: info@toeflpreparation.com</p>" +
            "<p>- Website: www.toeflpreparation.com</p>",
        type: ["TOEFL"]
    },
];
