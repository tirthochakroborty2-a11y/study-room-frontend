import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// ==================== BULK ADD COURSES ====================
export const bulkAddCourses = async (coursesArray) => {
  const results = {
    success: 0,
    failed: 0,
    errors: [],
    addedIds: [],
  };

  for (let i = 0; i < coursesArray.length; i++) {
    const course = coursesArray[i];
    try {
      const validation = validateCourse(course);
      if (!validation.valid) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${validation.error}`);
        continue;
      }

      const courseData = {
        id: parseInt(course.id),
        name: String(course.name).trim(),
        category: String(course.category).trim(),
        subCategory: course.subCategory ? String(course.subCategory).trim() : null,
        price: parseInt(course.price) || 0,
        originalPrice: parseInt(course.originalPrice) || 0,
        duration: String(course.duration || '').trim(),
        instructor: String(course.instructor || '').trim(),
        cycle: course.cycle ? String(course.cycle).trim() : null,
        type: course.type === 'free' ? 'free' : 'paid',
        telegramLink: course.telegramLink ? String(course.telegramLink).trim() : null,
        shortDesc: String(course.shortDesc || '').trim(),
        fullDesc: String(course.fullDesc || '').trim(),
        image: String(course.image || '').trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'courses'), courseData);
      results.success++;
      results.addedIds.push(docRef.id);
    } catch (error) {
      results.failed++;
      results.errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }

  return results;
};

// ==================== VALIDATE COURSE ====================
const validateCourse = (course) => {
  if (!course.id) return { valid: false, error: 'Missing ID' };
  if (!course.name) return { valid: false, error: 'Missing name' };
  if (!course.category) return { valid: false, error: 'Missing category' };
  if (!course.image) return { valid: false, error: 'Missing image' };
  if (course.type === 'paid' && (!course.price || course.price <= 0)) {
    return { valid: false, error: 'Paid course needs price' };
  }
  if (course.type === 'free' && !course.telegramLink) {
    return { valid: false, error: 'Free course needs Telegram link' };
  }
  return { valid: true };
};

// ==================== PARSE CSV ====================
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { courses: [], errors: ['CSV too short'] };

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const courses = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`);
      continue;
    }

    const course = {};
    headers.forEach((header, idx) => {
      course[header] = values[idx];
    });
    courses.push(course);
  }

  return { courses, errors };
};

const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

// ==================== PARSE JSON ====================
export const parseJSON = (jsonText) => {
  try {
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data)) {
      return { courses: [], errors: ['JSON must be an array'] };
    }
    return { courses: data, errors: [] };
  } catch (err) {
    return { courses: [], errors: [`JSON Error: ${err.message}`] };
  }
};
