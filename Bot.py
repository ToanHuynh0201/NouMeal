
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import uuid
import base64
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv

load_dotenv()  

app = Flask(__name__)
CORS(app)

# Lấy API key từ file .env
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

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


def call_openai_vision(prompt, images_base64, max_tokens=1500):
    """Gọi OpenAI Vision API với ảnh base64"""
    try:
        content = [{"type": "text", "text": prompt}]
        
        for img_b64 in images_base64:
            # Xử lý base64 (bỏ prefix nếu có)
            if ',' in img_b64:
                img_b64 = img_b64.split(',')[1]
            
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}
            })
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": content}],
            max_tokens=max_tokens,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise Exception(f"Vision API error: {str(e)}")
    
@app.route('/api/health', methods=['GET'])
def health_check():
    """Kiểm tra API hoạt động"""
    return jsonify({
        "status": "ok",
        "message": "Nutrition API đang hoạt động",
        "version": "1.0.0"
    }), 200


@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat tự do với AI dinh dưỡng"""
    try:
        data = request.json
        message = data.get("message", "").strip()
        session_id = data.get("session_id", str(uuid.uuid4()))
        
        if not message:
            return jsonify({"error": "Tin nhắn không được để trống"}), 400
        
        # Khởi tạo conversation nếu chưa có
        if session_id not in conversations:
            conversations[session_id] = []
        
        history = conversations[session_id]
        
        # Tạo messages với context
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(history[-10:])  # Lấy 10 tin nhắn gần nhất
        messages.append({"role": "user", "content": message})
        
        # Gọi OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )
        
        bot_reply = response.choices[0].message.content.strip()
        
        # Lưu lịch sử
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": bot_reply})
        
        return jsonify({
            "reply": bot_reply,
            "session_id": session_id
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


@app.route('/api/analyze-food', methods=['POST'])
def analyze_food():
    """Phân tích món ăn từ ảnh"""
    try:
        data = request.json
        image_base64 = data.get("image")
        health_condition = data.get("health_condition", "khỏe mạnh")
        dietary_goals = data.get("dietary_goals", "duy trì cân nặng")
        
        if not image_base64:
            return jsonify({"error": "Chưa có ảnh"}), 400
        
        prompt = f"""
        Phân tích món ăn trong ảnh cho người {health_condition}, mục tiêu {dietary_goals}:
        
        1. **Nhận diện món ăn**: Tên món, nguyên liệu chính
        2. **Dinh dưỡng**: Ước tính calo, protein, carb, fat
        3. **Đánh giá**: Mức độ phù hợp (⭐ 1-5 sao) + lý do
        4. **Ưu điểm**: Điểm tốt của món
        5. **Nhược điểm**: Điểm cần cải thiện
        6. **Gợi ý**: Cách ăn tốt hơn hoặc thay thế
        
        Trả lời ngắn gọn, thực tế, dễ hiểu.
        """
        
        result = call_openai_vision(prompt, [image_base64])
        
        return jsonify({
            "analysis": result
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
        
        prompt = f"""
        So sánh {len(images)} món ăn cho người {health_condition}:
        
        1. **Nhận diện**: Tên từng món
        2. **So sánh dinh dưỡng**: Bảng so sánh calo, protein, carb, fat
        3. **Xếp hạng**: Từ tốt nhất → kém nhất (giải thích)
        4. **Khuyến nghị**: Nên chọn món nào và tại sao
        5. **Lưu ý**: Cảnh báo nếu có món không phù hợp
        
        Trình bày rõ ràng, có emoji.
        """
        
        result = call_openai_vision(prompt, images, max_tokens=2000)
        
        return jsonify({
            "comparison": result,
            "total_foods": len(images)
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
        
        prompt = f"""
        Theo dõi calo từ {len(images)} bữa ăn hôm nay:
        Mục tiêu: {target_calories} kcal
        Sức khỏe: {health_condition}
        
        Yêu cầu:
        1. **Chi tiết bữa ăn**: Nhận diện món + calo từng bữa
        2. **Tổng calo**: Cộng tất cả bữa ăn
        3. **So sánh mục tiêu**: 
           - Đã ăn: X kcal
           - Mục tiêu: {target_calories} kcal
           - Chênh lệch: +/- Y kcal (Z%)
        4. **Phân tích**: Đánh giá tổng thể (tốt/vừa/quá nhiều/quá ít)
        5. **Gợi ý**: 
           - Nếu thiếu: món nên ăn thêm
           - Nếu thừa: cách điều chỉnh bữa sau
        
        Kèm biểu đồ ASCII nếu có thể.
        """
        
        result = call_openai_vision(prompt, images, max_tokens=2000)
        
        return jsonify({
            "tracking": result,
            "target": target_calories,
            "meals_count": len(images)
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


