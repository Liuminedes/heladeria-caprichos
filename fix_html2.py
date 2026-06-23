import re

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update navigation menu
content = content.replace('<a href="#salpicon">Salpicón & Ensaladas</a>', '<a href="#ensaladas">Ensaladas de Frutas</a>')

# 2. Update Oblea Frutal and Oblea Sencilla
content = content.replace('<h3 class="product-name">Frutal (clásico)</h3>', '<h3 class="product-name">Oblea Frutal</h3>')
content = content.replace('<img src="/images/Frutal Clasico.webp" alt="Frutal (clásico)"', '<img src="/images/Oblea Frutal.webp" alt="Oblea Frutal"')

content = content.replace('<h3 class="product-name">Sencilla</h3>', '<h3 class="product-name">Oblea Sencilla</h3>')
content = content.replace('<img src="/images/Sencilla.webp" alt="Sencilla"', '<img src="/images/Oblea Sencilla.webp" alt="Oblea Sencilla"')

# 3. Delete the 3rd Oblea completely
oblea_regex = r'<article class="product-card pending">[\s\S]*?<h3 class="product-name">Oblea <span class="badge">⚠️ Pendiente</span></h3>[\s\S]*?</article>'
content = re.sub(oblea_regex, '', content)

# 4. Inject Jugo Generico into #jugos
jugos_section_regex = r'(<section id="jugos" class="menu-section">)([\s\S]*?)(</section>)'
def replace_jugos(match):
    section_content = match.group(2)
    # Handle both <article class="product-card"> and <article class="product-card pending-price">
    section_content = re.sub(
        r'(<article class="product-card(?: pending-price)?">)\s*<div class="product-info">', 
        lambda m: m.group(1) + '\n          <div class="product-image"><img src="/images/Jugo Generico.webp" alt="Jugo Natural" class="product-image-element" loading="lazy"></div>\n          <div class="product-info">', 
        section_content
    )
    return match.group(1) + section_content + match.group(3)

content = re.sub(jugos_section_regex, replace_jugos, content)


# 5. Inject Bebida Generica into #bebidas
bebidas_section_regex = r'(<section id="bebidas" class="menu-section">)([\s\S]*?)(</section>)'
def replace_bebidas(match):
    section_content = match.group(2)
    section_content = re.sub(
        r'(<article class="product-card(?: pending-price)?">)\s*<div class="product-info">', 
        lambda m: m.group(1) + '\n          <div class="product-image"><img src="/images/Bebida Generica.webp" alt="Bebida" class="product-image-element" loading="lazy"></div>\n          <div class="product-info">', 
        section_content
    )
    return match.group(1) + section_content + match.group(3)

content = re.sub(bebidas_section_regex, replace_bebidas, content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('HTML updated with Obleas, Jugos, and Bebidas images.')
