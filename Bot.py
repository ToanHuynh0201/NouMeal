from flask import Flask, request, jsonify
from flask_cors import CORS
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
from openai import OpenAI
import base64
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# API Keys
CLARIFAI_PAT = os.getenv("CLARIFAI_PAT")
CLARIFAI_USER_ID = os.getenv("CLARIFAI_USER_ID")
CLARIFAI_APP_ID = os.getenv("CLARIFAI_APP_ID")
CLARIFAI_WORKFLOW_ID = os.getenv("CLARIFAI_WORKFLOW_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)
metadata = (("authorization", "Key " + CLARIFAI_PAT),)

conversations = {}
user_profiles = {}

SYSTEM_PROMPT = """Bạn là chuyên gia dinh dưỡng AI thân thiện của Việt Nam.

NHIỆM VỤ:
🥗 Tư vấn dinh dưỡng và món ăn Việt
📊 Phân tích thành phần dinh dưỡng
🍽️ Gợi ý thực đơn lành mạnh, phù hợp người Việt
💪 Hỗ trợ các vấn đề sức khỏe (tiểu đường, béo phì, tim mạch...)

PHONG CÁCH:
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
- Sử dụng emoji phù hợp
- Ưu tiên món ăn Việt Nam
- Khuyến khích lối sống lành mạnh"""


def recognize_food_with_clarifai(image_base64):
    """Nhận diện món ăn bằng Clarifai Workflow"""
    try:
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        image_bytes = base64.b64decode(image_base64)
        
        userDataObject = resources_pb2.UserAppIDSet(
            user_id=CLARIFAI_USER_ID,
            app_id=CLARIFAI_APP_ID
        )
        
        post_workflow_response = stub.PostWorkflowResults(
            service_pb2.PostWorkflowResultsRequest(
                user_app_id=userDataObject,
                workflow_id=CLARIFAI_WORKFLOW_ID,
                inputs=[
                    resources_pb2.Input(
                        data=resources_pb2.Data(
                            image=resources_pb2.Image(base64=image_bytes)
                        )
                    )
                ]
            ),
            metadata=metadata
        )
        
        if post_workflow_response.status.code != status_code_pb2.SUCCESS:
            raise Exception(f"Clarifai Error: {post_workflow_response.status.description}")
        
        results = post_workflow_response.results[0]
        detected_foods = []
        
        for output in results.outputs:
            if output.data.concepts:
                for concept in output.data.concepts:
                    if concept.value > 0.5:
                        detected_foods.append({
                            "name": concept.name,
                            "confidence": round(concept.value * 100, 2)
                        })
        
        seen = set()
        unique_foods = []
        for f in detected_foods:
            if f["name"] not in seen:
                unique_foods.append(f)
                seen.add(f["name"])
        
        return unique_foods
        
    except Exception as e:
        print(f"❌ Lỗi Clarifai: {str(e)}")
        return []


def call_openai_vision(prompt, images, max_tokens=1500):
    """Gọi OpenAI GPT-4 Vision"""
    try:
        content = [{"type": "text", "text": prompt}]
        
        for img in images:
            if ',' in img:
                img = img.split(',')[1]
            if not img.startswith('data:image'):
                img = f"data:image/jpeg;base64,{img}"
            
            content.append({
                "type": "image_url",
                "image_url": {"url": img, "detail": "high"}
            })
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": content}],
            max_tokens=max_tokens,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        raise Exception(f"OpenAI Vision Error: {str(e)}")


def call_openai_text(prompt, model="gpt-4o", max_tokens=1500):
    """Gọi OpenAI text completion"""
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "OK",
        "message": "Food Recognition API is running!",
        "endpoints": [
            "/api/chat",
            "/api/analyze-food",
            "/api/compare-foods",
            "/api/track-calories",
            "/api/quick-scan",
            "/api/meal-suggestion",
            "/api/weekly-menu",
            "/api/detailed-recipes",
            "/api/user/profile"
        ]
    }), 200


@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat với AI dinh dưỡng"""
    try:
        data = request.json
        message = data.get("message", "").strip()
        session_id = data.get("session_id", str(uuid.uuid4()))
        
        if not message:
            return jsonify({"error": "Tin nhắn không được để trống"}), 400
        
        if session_id not in conversations:
            conversations[session_id] = []
        
        history = conversations[session_id]
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(history[-10:])
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )
        
        bot_reply = response.choices[0].message.content.strip()
        
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": bot_reply})
        
        return jsonify({
            "reply": bot_reply,
            "session_id": session_id
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analyze-food', methods=['POST'])
def analyze_food():
    """Phân tích món ăn từ ảnh (Clarifai + OpenAI)"""
    try:
        data = request.json
        image_base64 = data.get("image")
        health_condition = data.get("health_condition", "khỏe mạnh")
        dietary_goals = data.get("dietary_goals", "duy trì cân nặng")
        
        if not image_base64:
            return jsonify({"error": "Chưa có ảnh"}), 400
        
        detected_foods = recognize_food_with_clarifai(image_base64)
        
        if not detected_foods:
            return jsonify({
                "error": "Không nhận diện được món ăn",
                "suggestion": "Vui lòng chụp ảnh rõ hơn hoặc thử ảnh khác"
            }), 400
        
        food_list = ", ".join([f"{f['name']} ({f['confidence']}%)" for f in detected_foods])
        
        prompt = f"""
Bạn là chuyên gia dinh dưỡng. Phân tích món ăn này cho người {health_condition}, mục tiêu {dietary_goals}.

**Món ăn đã nhận diện bởi AI:** {food_list}

Hãy phân tích chi tiết theo cấu trúc sau:

## 1. 🍽️ XÁC NHẬN MÓN ĂN
- Kiểm tra và xác nhận các món đã nhận diện
- Bổ sung thông tin về cách chế biến, khẩu phần

## 2. 📊 THÔNG TIN DINH DƯỠNG
- **Calo**: [X] kcal (cho 1 phần)
- **Protein**: [X]g
- **Carbohydrate**: [X]g (trong đó đường: [Y]g)
- **Chất béo**: [X]g (bão hòa: [Y]g)
- **Chất xơ**: [X]g
- **Vitamin & Khoáng chất**: Các chất nổi bật

## 3. ⭐ ĐÁNH GIÁ PHÙ HỢP
- **Mức độ**: ⭐⭐⭐⭐⭐ (1-5 sao)
- **Phù hợp với người {health_condition}**: Có/Không
- **Phù hợp với mục tiêu {dietary_goals}**: Có/Không
- **Giải thích**: Tại sao?

## 4. ✅ ƯU ĐIỂM
- Điểm mạnh về dinh dưỡng
- Lợi ích sức khỏe

## 5. ⚠️ NHƯỢC ĐIỂM
- Điểm cần lưu ý
- Rủi ro với người {health_condition}

## 6. 💡 GỢI Ý CẢI THIỆN
- Cách ăn tốt hơn (giảm calo, tăng dinh dưỡng)
- Món thay thế phù hợp hơn
- Lời khuyên cho người {health_condition}

Trả lời bằng tiếng Việt, ngắn gọn, thực tế, dễ hiểu. Dùng emoji phù hợp.
"""
        
        analysis = call_openai_vision(prompt, [image_base64], max_tokens=2000)
        
        return jsonify({
            "success": True,
            "detected_foods": detected_foods,
            "analysis": analysis,
            "health_condition": health_condition,
            "dietary_goals": dietary_goals
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/compare-foods', methods=['POST'])
def compare_foods():
    """So sánh nhiều món ăn"""
    try:
        data = request.json
        images = data.get("images", [])
        health_condition = data.get("health_condition", "khỏe mạnh")
        
        if not images or len(images) < 2:
            return jsonify({"error": "Cần ít nhất 2 ảnh để so sánh"}), 400
        
        all_detected_foods = []
        for idx, image in enumerate(images):
            foods = recognize_food_with_clarifai(image)
            all_detected_foods.append({
                "dish_number": idx + 1,
                "foods": foods
            })
        
        dishes_summary = ""
        for dish in all_detected_foods:
            food_names = ", ".join([f['name'] for f in dish['foods']])
            dishes_summary += f"\n- Món {dish['dish_number']}: {food_names}"
        
        prompt = f"""
Bạn là chuyên gia dinh dưỡng. So sánh {len(images)} món ăn cho người {health_condition}.

**Các món đã nhận diện:**{dishes_summary}

Hãy so sánh chi tiết theo cấu trúc:

## 1. 🍽️ XÁC NHẬN CÁC MÓN
Liệt kê và mô tả ngắn gọn từng món

## 2. 📊 BẢNG SO SÁNH DINH DƯỠNG

| Món | Calo | Protein | Carb | Fat | Chất xơ | Điểm |
|-----|------|---------|------|-----|---------|------|
| Món 1 | X kcal | Xg | Xg | Xg | Xg | ⭐⭐⭐⭐ |
| Món 2 | X kcal | Xg | Xg | Xg | Xg | ⭐⭐⭐ |
| ... | ... | ... | ... | ... | ... | ... |

## 3. 🏆 XẾP HẠNG (Từ tốt → kém)
1. 🥇 **Món X**: [Tên món] - [Lý do chi tiết]
2. 🥈 **Món Y**: [Tên món] - [Lý do chi tiết]
3. 🥉 **Món Z**: [Tên món] - [Lý do chi tiết]

## 4. 💡 KHUYẾN NGHỊ
- **Nên chọn**: Món nào và tại sao?
- **Tránh**: Món nào nếu có {health_condition}?
- **Lưu ý**: Điểm cần chú ý khi ăn

## 5. ⚠️ CẢNH BÁO ĐẶC BIỆT
- Món nào không phù hợp với người {health_condition}
- Lý do cụ thể

Trả lời bằng tiếng Việt, rõ ràng, có emoji, dễ đọc.
"""
        
        comparison = call_openai_vision(prompt, images, max_tokens=2500)
        
        return jsonify({
            "success": True,
            "detected_foods": all_detected_foods,
            "comparison": comparison,
            "total_foods": len(images),
            "health_condition": health_condition
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/track-calories', methods=['POST'])
def track_calories():
    """Theo dõi calo trong ngày"""
    try:
        data = request.json
        images = data.get("images", [])
        target_calories = data.get("target_calories", 2000)
        health_condition = data.get("health_condition", "khỏe mạnh")
        
        if not images:
            return jsonify({"error": "Chưa có ảnh bữa ăn"}), 400
        
        daily_meals = []
        meal_names = ["Sáng", "Trưa", "Tối", "Phụ"]
        
        for idx, image in enumerate(images):
            meal_name = meal_names[idx] if idx < len(meal_names) else f"Bữa {idx + 1}"
            foods = recognize_food_with_clarifai(image)
            daily_meals.append({
                "meal_number": idx + 1,
                "meal_name": f"Bữa {meal_name}",
                "foods": foods
            })
        
        meals_summary = ""
        for meal in daily_meals:
            food_names = ", ".join([f['name'] for f in meal['foods']])
            meals_summary += f"\n- {meal['meal_name']}: {food_names}"
        
        prompt = f"""
Bạn là chuyên gia dinh dưỡng. Theo dõi calo cho người {health_condition}.

**Các bữa ăn hôm nay:**{meals_summary}

**Mục tiêu hàng ngày:** {target_calories} kcal

Phân tích chi tiết theo cấu trúc:

## 1. 🍽️ CHI TIẾT TỪNG BỮA

### Bữa Sáng
- **Món**: [Liệt kê món]
- **Calo**: [X] kcal
- **Đánh giá**: ⭐⭐⭐⭐ (1-5 sao)

### Bữa Trưa
- **Món**: [Liệt kê món]
- **Calo**: [X] kcal
- **Đánh giá**: ⭐⭐⭐⭐

### Bữa Tối
- **Món**: [Liệt kê món]
- **Calo**: [X] kcal
- **Đánh giá**: ⭐⭐⭐

## 2. 📊 TỔNG HỢP
```
📊 TỔNG CALO: [X] kcal
🎯 MỤC TIÊU:  {target_calories} kcal
📈 CHÊNH LỆCH: [+/-Y] kcal ([Z]%)
```

**Trạng thái**: 
- ✅ Đạt mục tiêu
- ⚠️ Thừa X kcal  
- 🔴 Thiếu X kcal

## 3. 🥗 PHÂN BỐ DINH DƯỠNG

- **Protein**: [X]g ([Y]% tổng calo)
- **Carbs**: [X]g ([Y]% tổng calo)
- **Fat**: [X]g ([Y]% tổng calo)
- **Chất xơ**: [X]g

**Biểu đồ phân bố:**
```
Protein: [▓▓▓░░░░░░░] 30%
Carbs:   [▓▓▓▓▓░░░░░] 50%
Fat:     [▓▓░░░░░░░░] 20%
```

## 4. 💯 ĐÁNH GIÁ TỔNG THỂ

- 😊 Tốt / 😐 Chấp nhận được / 😟 Cần điều chỉnh
- **Lý do**: [Giải thích chi tiết]
- **Điểm mạnh**: [Gì tốt]
- **Điểm yếu**: [Gì cần cải thiện]

## 5. 💡 GỢI Ý

### Nếu THIẾU calo:
- Món nên ăn thêm: [Gợi ý cụ thể]
- Thời điểm nên ăn: [Buổi nào]

### Nếu THỪA calo:
- Cách điều chỉnh bữa sau
- Bữa nào nên giảm lượng

### Cân bằng dinh dưỡng:
- Thiếu/thừa chất gì
- Cách bổ sung

## 6. 📈 TIẾN ĐỘ HÔM NAY
```
Đã ăn:    [▓▓▓▓▓▓▓░░░] X%
Còn lại:  [Y] kcal
```

**Kế hoạch bữa tiếp theo**: [Gợi ý]

Trả lời bằng tiếng Việt, kèm emoji, dễ hiểu, thực tế.
"""
        
        tracking = call_openai_vision(prompt, images, max_tokens=3000)
        
        return jsonify({
            "success": True,
            "daily_meals": daily_meals,
            "tracking": tracking,
            "target_calories": target_calories,
            "meals_count": len(images),
            "health_condition": health_condition
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/quick-scan', methods=['POST'])
def quick_scan():
    """Quét nhanh món ăn - chỉ dùng Clarifai"""
    try:
        data = request.json
        image_base64 = data.get("image")
        
        if not image_base64:
            return jsonify({"error": "Chưa có ảnh"}), 400
        
        detected_foods = recognize_food_with_clarifai(image_base64)
        
        if not detected_foods:
            return jsonify({
                "error": "Không nhận diện được món ăn",
                "suggestion": "Vui lòng chụp ảnh rõ hơn"
            }), 400
        
        return jsonify({
            "success": True,
            "detected_foods": detected_foods,
            "total": len(detected_foods)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/meal-suggestion', methods=['POST'])
def meal_suggestion():
    """Gợi ý món ăn cho 1 bữa"""
    try:
        data = request.json
        health_condition = data.get("health_condition", "khỏe mạnh")
        dietary_preferences = data.get("dietary_preferences", "không")
        budget_range = data.get("budget_range", "100k")
        cooking_time = data.get("cooking_time", "30 phút")
        meal_time = data.get("meal_time", "trưa")
        
        prompt = f"""
Gợi ý thực đơn bữa {meal_time} cho người Việt:
- Tình trạng sức khỏe: {health_condition}
- Sở thích ăn uống: {dietary_preferences}
- Ngân sách: {budget_range}
- Thời gian nấu: {cooking_time}

Yêu cầu trả lời:
1. 2-3 món ăn Việt phù hợp
2. Lý do chọn (liên quan sức khỏe)
3. Cách chế biến đơn giản
4. Đồ uống kèm theo
5. Ước tính calo tổng

Format rõ ràng, dễ đọc với emoji.
"""
        
        result = call_openai_text(prompt, max_tokens=1200)
        
        return jsonify({
            "suggestion": result,
            "meal_time": meal_time
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/weekly-menu', methods=['POST'])
def weekly_menu():
    """Tạo thực đơn cả tuần"""
    try:
        data = request.json
        health_condition = data.get("health_condition", "khỏe mạnh")
        dietary_preferences = data.get("dietary_preferences", "không")
        budget_range = data.get("budget_range", "500k")
        cooking_time = data.get("cooking_time", "45 phút")
        
        prompt = f"""
Lập thực đơn 7 ngày cho người Việt:
- Sức khỏe: {health_condition}
- Sở thích: {dietary_preferences}
- Ngân sách mỗi ngày: {budget_range}
- Thời gian nấu: {cooking_time}

Format theo mẫu:
**Thứ 2:**
- Sáng: [món + calo]
- Trưa: [món + calo]
- Tối: [món + calo]

Kèm theo:
- Danh sách mua sắm cho cả tuần
- Tips tiết kiệm thời gian
- Tổng calo mỗi ngày
"""
        
        result = call_openai_text(prompt, model="gpt-4o", max_tokens=2500)
        
        return jsonify({
            "menu": result,
            "duration": "7 ngày"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/detailed-recipes', methods=['POST'])
def detailed_recipes():
    """Thực đơn kèm công thức nấu chi tiết"""
    try:
        data = request.json
        health_condition = data.get("health_condition", "khỏe mạnh")
        dietary_preferences = data.get("dietary_preferences", "không")
        budget_range = data.get("budget_range", "500k")
        days = data.get("days", 3)
        
        prompt = f"""
Tạo thực đơn {days} ngày với công thức chi tiết:
- Sức khỏe: {health_condition}
- Sở thích: {dietary_preferences}
- Ngân sách: {budget_range}

Mỗi món gồm:
1. Tên món và ảnh minh họa (mô tả)
2. Nguyên liệu cụ thể (khối lượng)
3. Các bước làm chi tiết
4. Thời gian chuẩn bị + nấu
5. Calo và dinh dưỡng
6. Chi phí ước tính
7. Tips hay
"""
        
        result = call_openai_text(prompt, model="gpt-4o", max_tokens=3000)
        
        return jsonify({
            "recipes": result,
            "days": days
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/user/profile', methods=['POST'])
def save_user_profile():
    """Lưu thông tin người dùng"""
    try:
        data = request.json
        user_id = data.get("user_id", str(uuid.uuid4()))
        
        user_profiles[user_id] = {
            "name": data.get("name"),
            "age": data.get("age"),
            "weight": data.get("weight"),
            "height": data.get("height"),
            "health_condition": data.get("health_condition", "khỏe mạnh"),
            "dietary_preferences": data.get("dietary_preferences", []),
            "allergies": data.get("allergies", []),
            "target_calories": data.get("target_calories", 2000),
            "activity_level": data.get("activity_level", "vừa phải")
        }
        
        return jsonify({
            "message": "Lưu thông tin thành công",
            "user_id": user_id
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/user/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Lấy thông tin người dùng"""
    if user_id not in user_profiles:
        return jsonify({"error": "Không tìm thấy người dùng"}), 404
    
    return jsonify(user_profiles[user_id]), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint không tồn tại"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Lỗi server"}), 500


if __name__ == "__main__":
    app.run(debug=True)