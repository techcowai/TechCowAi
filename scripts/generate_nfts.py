from PIL import Image, ImageDraw, ImageEnhance
import random
import json
import os
import colorsys

# Klasörleri oluştur
if not os.path.exists("assets"):
    os.makedirs("assets")
if not os.path.exists("assets/images"):
    os.makedirs("assets/images")
if not os.path.exists("assets/metadata"):
    os.makedirs("assets/metadata")

# Özellik setleri
BACKGROUNDS = ["green_field", "barn", "mountain", "sunset"]
BODY_COLORS = ["brown", "black", "white", "spotted"]
ACCESSORIES = ["none", "bell", "flower_crown", "bow_tie"]
EXPRESSIONS = ["happy", "sleepy", "curious", "excited"]

# Renk paletleri
COLORS = {
    "brown": (139, 69, 19),
    "black": (30, 30, 30),
    "white": (255, 255, 255),
    "spotted": [(255, 255, 255), (30, 30, 30)]
}

BACKGROUND_COLORS = {
    "green_field": (34, 139, 34),
    "barn": (139, 0, 0),
    "mountain": (105, 105, 105),
    "sunset": (255, 99, 71)
}

def draw_background(draw, image, background_type):
    width, height = image.size
    color = BACKGROUND_COLORS[background_type]
    
    # Arka plan gradyanı
    for y in range(height):
        r, g, b = color
        factor = 1 - (y / height * 0.3)
        draw.line([(0, y), (width, y)], fill=(int(r * factor), int(g * factor), int(b * factor)))

def draw_cow_body(draw, color, width, height):
    # Ana gövde
    body_points = [
        (width//2 - 150, height//2),
        (width//2 + 150, height//2),
        (width//2 + 100, height//2 + 100),
        (width//2 - 100, height//2 + 100)
    ]
    
    if color == "spotted":
        # Benekli desen için
        draw.polygon(body_points, fill=COLORS["white"][0])
        # Benekler ekle
        for _ in range(8):
            spot_x = random.randint(width//2 - 140, width//2 + 140)
            spot_y = random.randint(height//2 - 90, height//2 + 90)
            draw.ellipse([spot_x, spot_y, spot_x + 30, spot_y + 30], fill=COLORS["black"][0])
    else:
        draw.polygon(body_points, fill=COLORS[color])

def draw_accessories(draw, accessory_type, width, height):
    if accessory_type == "bell":
        # Çan çiz
        draw.ellipse([width//2 - 20, height//2 + 80, width//2 + 20, height//2 + 120], 
                     fill=(218, 165, 32))
    elif accessory_type == "flower_crown":
        # Çiçek tacı çiz
        for i in range(5):
            x = width//2 - 60 + i * 30
            draw.ellipse([x, height//2 - 140, x + 20, height//2 - 120], 
                        fill=(255, 192, 203))
    elif accessory_type == "bow_tie":
        # Papyon çiz
        draw.polygon([
            (width//2 - 30, height//2 + 60),
            (width//2 + 30, height//2 + 60),
            (width//2, height//2 + 80)
        ], fill=(255, 0, 0))

def draw_expression(draw, expression_type, width, height):
    if expression_type == "happy":
        # Mutlu göz ve ağız
        draw.arc([width//2 - 60, height//2 - 50, width//2 - 20, height//2 - 10], 0, 180, fill="black")
        draw.arc([width//2 + 20, height//2 - 50, width//2 + 60, height//2 - 10], 0, 180, fill="black")
        draw.arc([width//2 - 40, height//2 - 20, width//2 + 40, height//2 + 20], 0, 180, fill="black")
    elif expression_type == "sleepy":
        # Uykulu göz ve ağız
        draw.line([width//2 - 60, height//2 - 30, width//2 - 20, height//2 - 30], fill="black", width=3)
        draw.line([width//2 + 20, height//2 - 30, width//2 + 60, height//2 - 30], fill="black", width=3)
        draw.arc([width//2 - 20, height//2 - 10, width//2 + 20, height//2 + 10], 180, 0, fill="black")

def create_cow_image(id):
    # Canvas oluştur
    image = Image.new('RGB', (1000, 1000), 'white')
    draw = ImageDraw.Draw(image)
    
    # Özellikleri seç
    background = random.choice(BACKGROUNDS)
    body_color = random.choice(BODY_COLORS)
    accessory = random.choice(ACCESSORIES)
    expression = random.choice(EXPRESSIONS)
    
    # Çizimleri yap
    draw_background(draw, image, background)
    draw_cow_body(draw, body_color, 1000, 1000)
    draw_accessories(draw, accessory, 1000, 1000)
    draw_expression(draw, expression, 1000, 1000)
    
    # Görüntüyü geliştir
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.2)
    
    # Metadata oluştur
    metadata = {
        "name": f"CowAi #{id}",
        "description": "CowAi Collection NFT",
        "image": f"https://arweave.net/your-image-url/{id}.png",
        "attributes": [
            {"trait_type": "Background", "value": background},
            {"trait_type": "Body Color", "value": body_color},
            {"trait_type": "Accessory", "value": accessory},
            {"trait_type": "Expression", "value": expression}
        ]
    }
    
    # Kaydet
    image.save(f"assets/images/{id}.png")
    with open(f"assets/metadata/{id}.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    return metadata

# 1000 NFT oluştur
def generate_collection():
    collection_metadata = []
    for i in range(1000):
        metadata = create_cow_image(i)
        collection_metadata.append(metadata)
        print(f"Generated NFT #{i}")
    
    # Koleksiyon metadata'sını kaydet
    with open("assets/collection.json", 'w') as f:
        json.dump(collection_metadata, f, indent=2)

if __name__ == "__main__":
    generate_collection() 