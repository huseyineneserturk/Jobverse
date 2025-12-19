import csv
import json
import ast
import os
from pathlib import Path

# --- DOSYA YOLLARI ---
script_dir = Path(__file__).parent
csv_file = script_dir / 'veri_v1.csv'
json_file = script_dir / 'final_cleaned_jobs.json'

print(f'📂 CSV dosyası: {csv_file}')
print(f'📄 JSON çıktısı: {json_file}')

# --- ADIM 1: ESKİ DOSYAYI SİL ---
if json_file.exists():
    try:
        json_file.unlink()
        print(f'🗑️  Eski JSON dosyası silindi. Temiz başlangıç...')
    except PermissionError:
        print(f'⚠️  UYARI: Eski dosya silinemedi! Açık olabilir.')

if not csv_file.exists():
    print(f'❌ Hata: "veri_v1.csv" bulunamadı!')
    exit(1)

# --- AYARLAR ---

# Hangi kolonun JSON'da hangi isimle saklanacağı
column_mapping = {
    'job_title': 'jobTitle',
    'employer_name': 'employerName',
    'job_publisher': 'jobPublisher',
    'job_employment_type': 'jobEmploymentType',
    'job_apply_link': 'jobApplyLink',
    'job_description': 'jobDescription',
    'job_is_remote': 'jobIsRemote',
    # 'job_posted_at': 'jobPostedAt',  <-- BU ARTIK YOK (Aşağıda engellendi)
    'job_posted_at_datetime_utc': 'jobPostedAtDatetimeUtc', # <-- ALTIN MADENİ BURADA
    'job_location': 'jobLocation',
    'job_city': 'jobCity',
    'job_state': 'jobState',
    'job_country': 'jobCountry',
    'job_benefits': 'jobBenefits',
    'job_google_link': 'jobGoogleLink',
    'job_salary': 'jobSalary',
    'job_min_salary': 'jobMinSalary',
    'job_max_salary': 'jobMaxSalary',
    'job_salary_period': 'jobSalaryPeriod',
    'job_highlights': 'jobHighlights',
    'job_onet_soc': 'jobOnetSoc'
}

# --- YARDIMCI FONKSİYONLAR ---

def parse_structure(val):
    if not val: return None
    try:
        return ast.literal_eval(val)
    except:
        return None

def parse_bool(val):
    if not val: return False
    s_val = str(val).lower().strip()
    return s_val == 'true'

# --- ANA İŞLEM ---

jobs = []
encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
success = False

for encoding in encodings:
    try:
        print(f'🔄 {encoding} kodlaması deneniyor...')
        with open(csv_file, 'r', encoding=encoding, newline='', errors='replace') as f:
            reader = csv.DictReader(f)
            
            for idx, row in enumerate(reader, start=1):
                clean_job = {}
                clean_job['id'] = idx  # ID Ekleme (1, 2, 3...)

                for original_key, original_value in row.items():
                    
                    # --- KRİTİK DEĞİŞİKLİK: ÇÖP VERİYİ AT ---
                    if original_key == 'job_posted_at':
                        continue # Bu döngüyü atla, JSON'a ekleme yapma!
                    # ----------------------------------------

                    # Değerleri temizle
                    value = original_value.strip() if original_value else None
                    
                    # Yeni isim haritasından bak
                    new_key = column_mapping.get(original_key, original_key)
                    
                    # -- VERİ TİPİ DÖNÜŞÜMLERİ --
                    
                    if new_key in ['jobHighlights', 'jobBenefits']:
                        clean_job[new_key] = parse_structure(value)
                    
                    elif new_key == 'jobIsRemote':
                        clean_job[new_key] = parse_bool(value)
                    
                    elif new_key in ['jobOnetSoc', 'jobMinSalary', 'jobMaxSalary']:
                        try:
                            clean_job[new_key] = float(value) if value else None
                        except:
                            clean_job[new_key] = None
                    
                    else:
                        clean_job[new_key] = value

                jobs.append(clean_job)
            
            print(f'✅ Başarılı! {len(jobs):,} kayıt işlendi ({encoding})')
            success = True
            break
            
    except UnicodeDecodeError:
        continue
    except Exception as e:
        print(f'⚠️  Hata: {e}')
        break

if not success or not jobs:
    print('❌ Kayıt oluşturulamadı!')
    exit(1)

# --- KAYDETME ---
print(f'💾 JSON dosyasına yazılıyor...')
try:
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False, indent=4)
    print(f'✅ İŞLEM TAMAMLANDI! (Gereksiz tarih alanı çıkarıldı)')
except Exception as e:
    print(f'❌ Yazma hatası: {e}')