import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import volunteer_img from'./volunteer_img.png'
import Orthopedics from './Orthopedics.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Cardiology from './Cardiology.svg'
import Neurologist from './Neurologist.svg'
import Urology from './Urology.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    volunteer_img,
}




  
export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Cardiology',
        image: Cardiology
    },
    {
        speciality: 'Orthopedics',
        image: Orthopedics
    },
    {
        speciality: 'Urology',
        image: Urology
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 500,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'City General Hospital',
                location: '10th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Cardiology',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Larson is dedicated to providing excellent cardiac care and treatment with a focus on personalized healthcare.',
        fees: 600,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'Heart Care Hospital',
                location: '12th Street, London'
            }
        ]
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Orthopedics',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Patel specializes in orthopedic care and rehabilitation with a focus on bone health and musculoskeletal disorders.',
        fees: 300,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'OrthoCare Medical Center',
                location: '15th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Urology',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Lee provides specialized care for patients with urological conditions, ensuring the highest quality of treatment.',
        fees: 400,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'UroCare Institute',
                location: '22nd Avenue, London'
            }
        ]
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Garcia focuses on neurological disorders, offering comprehensive assessments and treatments to ensure optimal patient health.',
        fees: 500,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'NeuroLife Hospital',
                location: '9th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Williams is passionate about treating neurological conditions, utilizing cutting-edge treatments for various disorders.',
        fees: 600,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'BrainCare Medical Center',
                location: '11th Street, London'
            }
        ]
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis provides holistic care with a focus on preventive measures and early diagnosis for optimal patient health.',
        fees: 400,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'Global Health Clinic',
                location: '20th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Cardiology',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. White is dedicated to providing advanced heart care, helping patients achieve better cardiovascular health.',
        fees: 650,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'Heart Beat Clinic',
                location: '13th Street, London'
            }
        ]
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Orthopedics',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Mitchell provides expert care in the field of orthopedics, specializing in rehabilitation and sports injuries.',
        fees: 400,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'Advanced Orthopedics Center',
                location: '16th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Urology',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. King provides specialized care in urology, offering treatment for a variety of conditions affecting the urinary system.',
        fees: 400,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'UroCare Medical Hospital',
                location: '18th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Kelly specializes in neurological disorders, using advanced diagnostics and treatments to ensure the best care.',
        fees: 600,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'NeuroHealth Institute',
                location: '14th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Harris has a deep understanding of neurological conditions and provides expert treatment for a range of disorders.',
        fees: 500,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'MindCare Center',
                location: '19th Street, London'
            }
        ]
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Evans focuses on providing thorough medical care and promoting overall health with an emphasis on preventive care.',
        fees: 400,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'General Health Clinic',
                location: '21st Avenue, London'
            }
        ]
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Cardiology',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Martinez offers personalized cardiac care with a focus on patient education and prevention.',
        fees: 600,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'CardioLife Institute',
                location: '24th Avenue, London'
            }
        ]
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Orthopedics',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Hill provides orthopedic care focusing on bone health, joint replacement, and rehabilitation.',
        fees: 400,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        diagnosis_center: [
            {
                name: 'JointCare Medical Center',
                location: '10th Avenue, London'
            }
        ]
    }
]
