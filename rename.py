import os
import re

images_dir = r'public\images'

# The files generated have names like bebida_generica_1782231279797.webp
# We want to rename them
for filename in os.listdir(images_dir):
    if filename.endswith('.webp') and '_' in filename:
        match = re.match(r'^([a-zA-Z0-9\_]+?)_\d+\.webp$', filename)
        if match:
            raw_name = match.group(1)
            
            # Formulate the new name
            if 'bebida_generica' in raw_name: new_name = 'Bebida Generica.webp'
            elif 'jugo_generico' in raw_name: new_name = 'Jugo Generico.webp'
            elif 'oblea_sencilla' in raw_name: new_name = 'Oblea Sencilla.webp'
            elif 'media' in raw_name: continue # Ignore unrelated media files
            else:
                new_name = raw_name.replace('_', ' ').title() + '.webp'
            
            old_path = os.path.join(images_dir, filename)
            new_path = os.path.join(images_dir, new_name)
            
            if os.path.exists(new_path):
                os.remove(new_path)
            
            os.rename(old_path, new_path)
            print(f'Renamed {filename} to {new_name}')
            
# Also rename Frutal Clasico to Oblea Frutal
old_frutal = os.path.join(images_dir, 'Frutal Clasico.webp')
new_frutal = os.path.join(images_dir, 'Oblea Frutal.webp')
if os.path.exists(old_frutal):
    os.rename(old_frutal, new_frutal)
    print("Renamed Frutal Clasico.webp to Oblea Frutal.webp")
