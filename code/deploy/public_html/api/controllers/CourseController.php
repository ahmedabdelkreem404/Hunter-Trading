<?php
/**
 * Course Controller
 * Handles course and lesson management
 */

require_once __DIR__ . '/../config/database.php';

class CourseController {
    
    /**
     * Get all courses
     */
    public function getCourses() {
        try {
            $courses = fetchAll("
                SELECT c.*, 
                       (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as lesson_count,
                       (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) as student_count
                FROM courses c
                ORDER BY c.level, c.created_at DESC
            ");
            
            // Get lessons for each course
            foreach ($courses as &$course) {
                $course['lessons'] = fetchAll(
                    "SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index",
                    [$course['id']]
                );
            }
            
            return json_encode([
                'success' => true,
                'data' => $courses
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch courses'
            ]);
        }
    }
    
    /**
     * Get single course with lessons
     */
    public function getCourse($id) {
        try {
            $course = fetchOne("SELECT * FROM courses WHERE id = ?", [$id]);
            
            if (!$course) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Course not found'
                ]);
            }
            
            $course['lessons'] = fetchAll(
                "SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index",
                [$id]
            );
            
            return json_encode([
                'success' => true,
                'data' => $course
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch course'
            ]);
        }
    }
    
    /**
     * Create new course (Admin only)
     */
    public function createCourse($data) {
        try {
            $required = ['title_en', 'title_ar', 'description_en', 'description_ar', 'level'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'error' => "Missing required field: $field"
                    ]);
                }
            }
            
            $id = insert(
                "INSERT INTO courses (title_en, title_ar, description_en, description_ar, level, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['title_en'],
                    $data['title_ar'],
                    $data['description_en'],
                    $data['description_ar'],
                    $data['level'],
                    $data['image_url'] ?? null
                ]
            );
            
            return json_encode([
                'success' => true,
                'data' => ['id' => $id]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to create course'
            ]);
        }
    }
    
    /**
     * Update course (Admin only)
     */
    public function updateCourse($data) {
        try {
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Course ID required'
                ]);
            }
            
            $fields = [];
            $params = [];
            
            $allowedFields = ['title_en', 'title_ar', 'description_en', 'description_ar', 'level', 'image_url'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }
            
            if (empty($fields)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No fields to update'
                ]);
            }
            
            $params[] = $data['id'];
            $sql = "UPDATE courses SET " . implode(', ', $fields) . " WHERE id = ?";
            
            modify($sql, $params);
            
            return json_encode([
                'success' => true,
                'message' => 'Course updated successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update course'
            ]);
        }
    }
    
    /**
     * Delete course (Admin only)
     */
    public function deleteCourse($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Course ID required'
                ]);
            }
            
            // Delete lessons first
            modify("DELETE FROM lessons WHERE course_id = ?", [$id]);
            modify("DELETE FROM courses WHERE id = ?", [$id]);
            
            return json_encode([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to delete course'
            ]);
        }
    }
}
