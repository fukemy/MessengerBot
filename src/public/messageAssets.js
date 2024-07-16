import OpenAI from 'openai';
require("dotenv").config();
const openAI = new OpenAI({
    apiKey: process.env.GPT_KEY
})

const allChats = []

const welcomeResponse = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [{
                "title": "Gia đình ủn xin chào 🥰🥰!",
                "subtitle": "Bạn đang quan tâm loại chiếu nào",
                "image_url": 'https://i.ibb.co/LZn0V8b/435484455-971317474615838-9066041265441118539-n.jpg',
            }]
        }
    }
}

const allProductResponse = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Chiếu 1m6",
                    "subtitle": "Loại chiếu dành cho giường 1m6x1m8, mát mẻ thoải mái với 2 người ngủ",
                    "image_url": 'https://bizweb.dktcdn.net/100/415/684/products/336881915-1947232922292426-2560003340095576828-n-1679302924093.jpg?v=1679366520793',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem thông tin",
                            "payload": "1m6",
                        }
                    ]
                },
                {
                    "title": "Chiếu 1m8",
                    "subtitle": "Thích hợp cho 2 người ngủ hoặc có thêm trẻ con từ 0 -> 6 tháng, cả bố mẹ nằm ngủ với con mà vẫn đủ không gian nằm",
                    "image_url": 'https://bizweb.dktcdn.net/thumb/1024x1024/100/415/684/products/336998869-211516721468134-3560786077261201405-n-1679302924094.jpg',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem thông tin",
                            "payload": "1m8",
                        }
                    ],
                },
                {
                    "title": "Chiếu 2m2",
                    "subtitle": "Thoải mái với 2 người ngủ và con nhỏ trên 1 tuổi, hoặc nằm 4 người mà vẫn thoải mái, mát mẻ với dòng chiếu này",
                    "image_url": 'https://bizweb.dktcdn.net/100/415/684/products/336881915-1947232922292426-2560003340095576828-n-1679302924093.jpg?v=1679366520793',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem thông tin",
                            "payload": "2m2",
                        }
                    ],
                }
            ]
        }
    }
}

const message1m6_1 = [
    { "text": "Đây là nội dung giới thiệu 1" },
    { "text": "Đây là nội dung giới thiệu 2" },
    { "text": "Đây là nội dung giới thiệu 3" },
    {
        "attachment": {
            "type": "image",
            "payload": {
                "attachment_id": "1487314045203133"
            }
        }
    },
    {
        "attachment": {
            "type": "image",
            "payload": {
                "attachment_id": "1487314045203133"
            }
        }
    },
    {
        "attachment": {
            "type": "video",
            "payload": {
                "attachment_id": "799446442126822"
            }
        }
    },
    {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    },
                    {
                        "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    },
                    {
                        "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    },
                ],
            }
        }
    },
    {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Trên đây là toàn bộ thông tin về 1m6",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Tôi muốn mua",
                        "payload": "BUY_1m6",
                    },
                    {
                        "type": "postback",
                        "title": "Tìm hiểu thêm thông tin",
                        "payload": "GO_SHOPPE_1m6",
                    }
                ]
            }
        }
    }
]

const postback1m6Response = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Đây là mẫu chiếu abcc",
                    "subtitle": "Đây là nội dung abcccc\n 300.000 VNĐ",
                    "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tôi muốn mua",
                            "payload": "BUY_1m6",
                        },
                        {
                            "type": "postback",
                            "title": "Tìm hiểu thêm thông tin",
                            "payload": "GO_SHOPPE_1m6",
                        }
                    ]
                },
                {
                    "title": "Đây là mẫu chiếu abcc",
                    "subtitle": "Đây là nội dung abcccc\n 300.000 VNĐ",
                    "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tôi muốn mua",
                            "payload": "BUY_1m6",
                        },
                        {
                            "type": "postback",
                            "title": "Tìm hiểu thêm thông tin",
                            "payload": "GO_SHOPPE_1m6",
                        }
                    ]
                },
            ],
        }
    }
}

const messageImage1m6Response = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Đây là mẫu chiếu abcc",
                    "subtitle": "Đây là nội dung abcccc\n 300.000 VNĐ",
                    "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tôi muốn mua",
                            "payload": "BUY_1m6",
                        },
                        {
                            "type": "postback",
                            "title": "Tìm hiểu thêm thông tin",
                            "payload": "GO_SHOPPE_1m6",
                        }
                    ]
                },
                {
                    "title": "Đây là mẫu chiếu abcc",
                    "subtitle": "Đây là nội dung abcccc\n 300.000 VNĐ",
                    "image_url": 'https://khodemhanoi.vn/wp-content/uploads/2019/03/chieu-dieu-hoa-2-copy.jpg',
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tôi muốn mua",
                            "payload": "BUY_1m6",
                        },
                        {
                            "type": "postback",
                            "title": "Tìm hiểu thêm thông tin",
                            "payload": "GO_SHOPPE_1m6",
                        }
                    ]
                },

            ],
        }
    }
}

const requireCustomerInfoResponse = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "customer_information",
            "countries": [
                // "VN"
            ],
            "contact_overrides": [
                {
                    "email": {
                        "required": true
                    },
                    "phone": {
                        "required": true
                    }
                }
            ],
            "business_privacy": {
                "url": "https://www.facebook.com/privacy/explanation"
            },
            "expires_in_days": 1
        }
    }

}

const gptResponse = async (id, question) => {
    try {
        const indexOfID = allChats.findIndex(c => c.id === id)
        const newContext = []
        if (indexOfID == -1) {
            newContext.push({ "role": "system", "content": "Bạn là 1 trợ lý bán chiếu điều hoà, hãy cố gắng trả lời đầy đủ, nếu không thể trả lời hãy nói: 'Chúng tôi đã nhận được tin và sẽ phản hồi lại sớm!'" })
        }
        newContext.push({ role: 'user', content: question })
        // console.log('lastmessage', lastMessage)
        const result = await openAI.chat.completions.create({
            messages: indexOfID == -1 ? newContext : allChats[indexOfID].messages,
            model: process.env.GPT_MODEL
        })
        const answerText = result.choices[0].message.content
        newContext.push({ role: 'assistant', content: answerText })
        if (indexOfID >= 0) {
            allChats[indexOfID] = {
                id: allChats[indexOfID].id,
                messages: [...allChats[indexOfID].messages, ...newContext]
            }
        } else {
            allChats.push({ id: id, messages: newContext })
        }
        console.log('allChat', JSON.stringify(allChats))
        return { "text": answerText }
    } catch (error) {
        console.log('gpt error', error.message)
        return { "text": "Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất" }
    }
}

const WHAT_IS = 'Đây là loại phụ kiện giúp làm mát cơ thể khi nằm trong những ngày nóng bức. Chúng không cần sử dụng máy móc hay thiết bị làm mát mà chỉ tận dụng khả năng giảm nhiệt từ các chất liệu như lụa, sợi mây, vải Tencel… Chiếu có nhiều loại khác nhau phù hợp với nhu cầu và sở thích của người dùng. Loại chiếu này có tác dụng tạo cảm giác mát mẻ, thông thoáng, thấm hút mồ hôi và ngăn ngừa vi khuẩn. Chiếu điều hòa cũng có thể thay thế ga trải giường, tăng tính thẩm mỹ cho không gian ngủ. Tuy nhiên, khi sử dụng chiếu, bạn cũng cần chú ý đến việc chọn kích thước phù hợp với giường, chất liệu an toàn và bền bỉ.'
const DIFFERENCE_BETWEEN = 'Bạn có thể hiểu đơn giản, chiếu điều hòa được làm từ sợi mây đan vào nhau, mặt dưới lót bằng vải không, xung quanh chiếu được dệt bằng vải lại tạo nên nét đẹp sang trọng và đảm bảo tính thẩm mỹ cao. Nhờ đó mà chiếu cực kỳ thoáng khí và mát mẻ mỗi khi sử dụng, thích hợp dùng trong những ngày hè nóng nực. \nKhi sử dụng chiếu điều hòa chúng sẽ hấp thu nhiệt để mang đến cho bạn cảm giác mát mẻ, dễ chịu. Thiết kế đặc biệt, sợi mây khi đan xen với nhau có thể tạo nên hàng nghìn lỗ thông khí rất thoáng mát nhưng chúng lại không gây lạnh sống lưng vì thế mà người lớn tuổi và trẻ em đều có thể sử dụng được. \nkhi sử dụng trong phòng có điều hòa, chiếu mây sẽ hấp thu nhiệt và giúp chúng ta luôn cảm thấy thoải mái và dễ chịu. Với chất liệu hoàn toàn từ tự nhiên, sản phẩm bền, đẹp và tuyệt đối an toàn cho sức khỏe cả nhà bạn.'

module.exports = {
    welcomeResponse,
    allProductResponse,
    postback1m6Response,
    message1m6_1,
    requireCustomerInfoResponse,
    gptResponse,
    WHAT_IS,
    DIFFERENCE_BETWEEN
}