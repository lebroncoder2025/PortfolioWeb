<?php
/**
 * Site data routes
 */

function getSiteData() {
    $db = Database::getInstance();
    
    // Fetch all sections
    $hero = $db->fetchOne('SELECT * FROM site_hero LIMIT 1') ?: ['title' => '', 'subtitle' => '', 'image' => ''];
    
    $about = $db->fetchOne('SELECT * FROM site_about LIMIT 1');
    if ($about) {
        $about['stats'] = $about['stats'] ? json_decode($about['stats'], true) : [];
    } else {
        $about = ['title' => '', 'bio' => '', 'image' => '', 'stats' => []];
    }
    
    $contact = $db->fetchOne('SELECT * FROM site_contact LIMIT 1') ?: ['email' => '', 'phone' => '', 'location' => ''];
    
    $services = $db->fetchAll('SELECT * FROM services ORDER BY `order` ASC');
    
    $categories = $db->fetchAll('SELECT * FROM categories ORDER BY name ASC');
    
    $portfolioItems = $db->fetchAll('SELECT * FROM portfolio ORDER BY `order` ASC');
    
    $layoutRows = $db->fetchAll('SELECT * FROM layout ORDER BY `order` ASC');
    
    $socialRow = $db->fetchOne('SELECT * FROM site_social LIMIT 1');
    
    // Get portfolio images and featured media
    $portfolioIds = array_filter(array_column($portfolioItems, 'id'));
    $imagesMap = [];
    $featuredMap = [];
    
    if (!empty($portfolioIds)) {
        $placeholders = implode(',', array_fill(0, count($portfolioIds), '?'));
        
        $images = $db->fetchAll(
            "SELECT * FROM portfolio_images WHERE portfolio_id IN ($placeholders) ORDER BY `order` ASC",
            $portfolioIds
        );
        
        foreach ($images as $img) {
            if (!isset($imagesMap[$img['portfolio_id']])) {
                $imagesMap[$img['portfolio_id']] = [];
            }
            $imagesMap[$img['portfolio_id']][] = ['url' => $img['url'], 'caption' => $img['caption'] ?? ''];
        }
        
        $featured = $db->fetchAll(
            "SELECT * FROM portfolio_featured WHERE portfolio_id IN ($placeholders)",
            $portfolioIds
        );
        
        foreach ($featured as $fm) {
            $featuredMap[$fm['portfolio_id']] = ['url' => $fm['url'], 'caption' => $fm['caption'] ?? ''];
        }
    }
    
    // Build portfolio with media
    $portfolio = [];
    foreach ($portfolioItems as $p) {
        $pImages = $imagesMap[$p['id']] ?? [];
        if (empty($pImages) && !empty($p['images'])) {
            $pImages = is_string($p['images']) ? json_decode($p['images'], true) : $p['images'];
        }
        
        $pFeatured = $featuredMap[$p['id']] ?? null;
        if (!$pFeatured && !empty($p['featuredMedia'])) {
            $pFeatured = is_string($p['featuredMedia']) ? json_decode($p['featuredMedia'], true) : $p['featuredMedia'];
        }
        
        $portfolio[] = [
            'id' => $p['id'],
            'title' => $p['title'],
            'category' => $p['category'],
            'images' => $pImages ?: [],
            'video' => $p['video'] ?? null,
            'order' => $p['order'],
            'featuredMedia' => $pFeatured
        ];
    }
    
    // Build layout
    $layout = [];
    foreach ($layoutRows as $l) {
        $layout[] = [
            'id' => $l['sectionId'],
            'visible' => (bool)$l['visible'],
            'order' => $l['order']
        ];
    }
    
    // Build social
    $social = [];
    if ($socialRow) {
        $social = [
            'facebook' => $socialRow['facebook'] ?? '',
            'instagram' => $socialRow['instagram'] ?? '',
            'twitter' => $socialRow['twitter'] ?? '',
            'tiktok' => $socialRow['tiktok'] ?? '',
            'youtube' => $socialRow['youtube'] ?? '',
            'linkedin' => $socialRow['linkedin'] ?? '',
            'pinterest' => $socialRow['pinterest'] ?? '',
            'canva' => $socialRow['canva'] ?? ''
        ];
    }
    
    $response = [
        'hero' => $hero,
        'about' => $about,
        'contact' => $contact,
        'services' => $services,
        'categories' => $categories,
        'portfolio' => $portfolio,
        'layout' => $layout,
        'social' => $social
    ];
    
    // Normalize URLs for uploads
    $response = normalizeUrls($response);
    
    jsonResponse($response);
}

function handleSiteUpdate($uri, $method, $user) {
    // Parse the section from URI
    preg_match('#/site/(\w+)(?:/(.+))?#', $uri, $matches);
    $section = $matches[1] ?? '';
    $id = $matches[2] ?? null;
    
    switch ($section) {
        case 'hero':
            updateHero($user);
            break;
        case 'about':
            updateAbout($user);
            break;
        case 'contact':
            updateContact($user);
            break;
        case 'social':
            updateSocial($user);
            break;
        case 'services':
            handleServices($method, $id, $user);
            break;
        case 'portfolio':
            handlePortfolio($method, $id, $user);
            break;
        case 'categories':
            updateCategories($user);
            break;
        case 'layout':
            updateLayout($user);
            break;
        default:
            errorResponse('Unknown section', 404);
    }
}

function updateHero($user) {
    $db = Database::getInstance();
    
    $title = $_POST['title'] ?? null;
    $subtitle = $_POST['subtitle'] ?? null;
    $image = null;
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = handleFileUpload($_FILES['image']);
    }
    
    $db->query(
        'UPDATE site_hero SET 
            title = COALESCE(?, title),
            subtitle = COALESCE(?, subtitle),
            image = COALESCE(?, image)',
        [
            $title ? sanitizeString($title, 200) : null,
            $subtitle ? sanitizeString($subtitle, 300) : null,
            $image
        ]
    );
    
    // Log
    $changedFields = array_filter([
        $title ? 'tytuł' : null,
        $subtitle ? 'podtytuł' : null,
        $image ? 'zdjęcie' : null
    ]);
    
    if (!empty($changedFields)) {
        logUserAction($user['userId'], 'update_hero', [
            'changedFields' => $changedFields,
            'timestamp' => date('d.m.Y H:i:s')
        ], null, 'content');
    }
    
    $result = $db->fetchOne('SELECT * FROM site_hero LIMIT 1');
    jsonResponse($result);
}

function updateAbout($user) {
    $db = Database::getInstance();
    
    $title = $_POST['title'] ?? null;
    $bio = $_POST['bio'] ?? null;
    $stats = $_POST['stats'] ?? null;
    $image = null;
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = handleFileUpload($_FILES['image']);
    }
    
    $statsJson = null;
    if ($stats) {
        try {
            $parsed = is_array($stats) ? $stats : json_decode($stats, true);
            $statsJson = json_encode(array_map(function($s) {
                return [
                    'label' => sanitizeString($s['label'] ?? '', 100),
                    'value' => is_int($s['value']) ? $s['value'] : 0
                ];
            }, $parsed));
        } catch (Exception $e) {
            // Invalid stats JSON, ignore
        }
    }
    
    $db->query(
        'UPDATE site_about SET 
            title = COALESCE(?, title),
            bio = COALESCE(?, bio),
            image = COALESCE(?, image),
            stats = COALESCE(?, stats)',
        [
            $title ? sanitizeString($title, 200) : null,
            $bio ? sanitizeString($bio, 2000) : null,
            $image,
            $statsJson
        ]
    );
    
    // Log
    $changedFields = array_filter([
        $title ? 'tytuł' : null,
        $bio ? 'biografia' : null,
        $image ? 'zdjęcie' : null,
        $stats ? 'statystyki' : null
    ]);
    
    if (!empty($changedFields)) {
        logUserAction($user['userId'], 'update_about', [
            'changedFields' => $changedFields,
            'timestamp' => date('d.m.Y H:i:s')
        ], null, 'content');
    }
    
    $result = $db->fetchOne('SELECT * FROM site_about LIMIT 1');
    $result['stats'] = $result['stats'] ? json_decode($result['stats'], true) : [];
    jsonResponse($result);
}

function updateContact($user) {
    $db = Database::getInstance();
    $data = getJsonBody();
    
    $email = $data['email'] ?? null;
    $phone = $data['phone'] ?? null;
    $location = $data['location'] ?? null;
    
    if ($email && !validateEmail($email)) {
        errorResponse('Invalid email format', 400);
    }
    
    $db->query(
        'UPDATE site_contact SET 
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            location = COALESCE(?, location)',
        [
            $email,
            $phone ? sanitizeString($phone, 20) : null,
            $location ? sanitizeString($location, 200) : null
        ]
    );
    
    // Log
    $changedFields = array_filter([
        $email ? 'email' : null,
        $phone ? 'telefon' : null,
        $location ? 'lokalizacja' : null
    ]);
    
    if (!empty($changedFields)) {
        logUserAction($user['userId'], 'update_contact', [
            'changedFields' => $changedFields,
            'timestamp' => date('d.m.Y H:i:s')
        ], null, 'content');
    }
    
    $result = $db->fetchOne('SELECT * FROM site_contact LIMIT 1');
    jsonResponse($result);
}

function updateSocial($user) {
    $db = Database::getInstance();
    $data = getJsonBody();
    
    // Get current data
    $current = $db->fetchOne('SELECT * FROM site_social LIMIT 1');
    
    $fields = ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'linkedin', 'pinterest', 'canva'];
    
    // Check if row exists
    if ($current) {
        $db->query(
            'UPDATE site_social SET facebook=?, instagram=?, twitter=?, tiktok=?, youtube=?, linkedin=?, pinterest=?, canva=? WHERE id=1',
            [
                $data['facebook'] ?? '',
                $data['instagram'] ?? '',
                $data['twitter'] ?? '',
                $data['tiktok'] ?? '',
                $data['youtube'] ?? '',
                $data['linkedin'] ?? '',
                $data['pinterest'] ?? '',
                $data['canva'] ?? ''
            ]
        );
    } else {
        $db->query(
            'INSERT INTO site_social (id, facebook, instagram, twitter, tiktok, youtube, linkedin, pinterest, canva) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $data['facebook'] ?? '',
                $data['instagram'] ?? '',
                $data['twitter'] ?? '',
                $data['tiktok'] ?? '',
                $data['youtube'] ?? '',
                $data['linkedin'] ?? '',
                $data['pinterest'] ?? '',
                $data['canva'] ?? ''
            ]
        );
    }
    
    // Track changes
    $changedFields = [];
    foreach ($fields as $field) {
        if (($data[$field] ?? '') !== ($current[$field] ?? '')) {
            $changedFields[] = $field;
        }
    }
    
    if (!empty($changedFields)) {
        logUserAction($user['userId'], 'update_social', [
            'changedFields' => $changedFields,
            'timestamp' => date('d.m.Y H:i:s')
        ], null, 'content');
    }
    
    jsonResponse($data);
}

function handleServices($method, $id, $user) {
    $db = Database::getInstance();
    
    switch ($method) {
        case 'POST':
            $data = getJsonBody();
            $newId = generateUUID();
            
            $count = $db->fetchOne('SELECT COUNT(*) as count FROM services');
            $nextOrder = ($count['count'] ?? 0) + 1;
            
            $db->insert('services', [
                'id' => $newId,
                'title' => sanitizeString($data['title'] ?? '', 200),
                'description' => sanitizeString($data['description'] ?? '', 1000),
                'icon' => $data['icon'] ?? '📌',
                'order' => $nextOrder
            ]);
            
            logUserAction($user['userId'], 'create_service', [
                'title' => sanitizeString($data['title'] ?? '', 200),
                'timestamp' => date('d.m.Y H:i:s')
            ], null, 'content');
            
            $result = $db->fetchOne('SELECT * FROM services WHERE id = ?', [$newId]);
            jsonResponse($result);
            break;
            
        case 'PUT':
            if (!$id) errorResponse('Service ID required', 400);
            
            $data = getJsonBody();
            
            $db->query(
                'UPDATE services SET title = ?, description = ?, icon = ?, `order` = ? WHERE id = ?',
                [
                    sanitizeString($data['title'] ?? '', 200),
                    sanitizeString($data['description'] ?? '', 1000),
                    $data['icon'] ?? '📌',
                    $data['order'] ?? 0,
                    $id
                ]
            );
            
            logUserAction($user['userId'], 'update_service', [
                'title' => sanitizeString($data['title'] ?? '', 200),
                'timestamp' => date('d.m.Y H:i:s')
            ], null, 'content');
            
            $result = $db->fetchOne('SELECT * FROM services WHERE id = ?', [$id]);
            if (!$result) errorResponse('Service not found', 404);
            jsonResponse($result);
            break;
            
        case 'DELETE':
            if (!$id) errorResponse('Service ID required', 400);
            $db->delete('services', 'id = ?', [$id]);
            jsonResponse(['success' => true]);
            break;
            
        default:
            errorResponse('Method not allowed', 405);
    }
}

function handlePortfolio($method, $id, $user) {
    $db = Database::getInstance();
    
    switch ($method) {
        case 'POST':
            createPortfolioItem($db, $user);
            break;
            
        case 'PUT':
            if (!$id) errorResponse('Portfolio ID required', 400);
            updatePortfolioItem($db, $id, $user);
            break;
            
        case 'DELETE':
            if (!$id) errorResponse('Portfolio ID required', 400);
            $db->delete('portfolio', 'id = ?', [$id]);
            $db->delete('portfolio_images', 'portfolio_id = ?', [$id]);
            $db->delete('portfolio_featured', 'portfolio_id = ?', [$id]);
            jsonResponse(['success' => true]);
            break;
            
        default:
            errorResponse('Method not allowed', 405);
    }
}

function createPortfolioItem($db, $user) {
    $newId = generateUUID();
    
    $title = $_POST['title'] ?? '';
    $category = $_POST['category'] ?? '';
    $video = $_POST['video'] ?? null;
    $images = $_POST['images'] ?? '[]';
    $featuredMedia = $_POST['featuredMedia'] ?? null;
    
    // Parse images
    $imagesArray = [];
    if ($images) {
        try {
            $parsed = is_array($images) ? $images : json_decode($images, true);
            $imagesArray = normalizeImagesArray($parsed ?: []);
        } catch (Exception $e) {}
    }
    
    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadedUrl = handleFileUpload($_FILES['image']);
        if ($uploadedUrl) {
            $imagesArray[] = ['url' => $uploadedUrl, 'caption' => ''];
        }
    }
    
    $count = $db->fetchOne('SELECT COUNT(*) as count FROM portfolio');
    $nextOrder = ($count['count'] ?? 0) + 1;
    
    $db->beginTransaction();
    try {
        $db->insert('portfolio', [
            'id' => $newId,
            'title' => sanitizeString($title, 200),
            'category' => $category,
            'images' => json_encode($imagesArray),
            'video' => $video,
            'order' => $nextOrder
        ]);
        
        // Insert images
        foreach ($imagesArray as $i => $img) {
            $db->insert('portfolio_images', [
                'id' => generateUUID(),
                'portfolio_id' => $newId,
                'url' => $img['url'],
                'caption' => $img['caption'] ?? '',
                'order' => $i + 1
            ]);
        }
        
        // Featured media
        if ($featuredMedia) {
            $fm = is_string($featuredMedia) ? json_decode($featuredMedia, true) : $featuredMedia;
            if ($fm && !empty($fm['url'])) {
                $db->insert('portfolio_featured', [
                    'portfolio_id' => $newId,
                    'url' => $fm['url'],
                    'caption' => $fm['caption'] ?? ''
                ]);
            }
        }
        
        $db->commit();
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
    logUserAction($user['userId'], 'create_portfolio', [
        'portfolioId' => $newId,
        'title' => $title,
        'category' => $category,
        'imagesCount' => count($imagesArray),
        'hasVideo' => !empty($video),
        'timestamp' => date('d.m.Y H:i:s')
    ], null, 'content');
    
    $result = $db->fetchOne('SELECT * FROM portfolio WHERE id = ?', [$newId]);
    $result['images'] = $imagesArray;
    $result['featuredMedia'] = $featuredMedia ? (is_string($featuredMedia) ? json_decode($featuredMedia, true) : $featuredMedia) : null;
    
    jsonResponse($result);
}

function updatePortfolioItem($db, $id, $user) {
    $existing = $db->fetchOne('SELECT * FROM portfolio WHERE id = ?', [$id]);
    if (!$existing) {
        errorResponse('Portfolio item not found', 404);
    }
    
    $title = $_POST['title'] ?? $existing['title'];
    $category = $_POST['category'] ?? $existing['category'];
    $video = $_POST['video'] ?? $existing['video'];
    $order = $_POST['order'] ?? $existing['order'];
    $images = $_POST['images'] ?? null;
    $featuredMedia = $_POST['featuredMedia'] ?? null;
    
    // Parse images
    $imagesArray = [];
    if ($images) {
        try {
            $parsed = is_array($images) ? $images : json_decode($images, true);
            $imagesArray = normalizeImagesArray($parsed ?: []);
        } catch (Exception $e) {
            $imagesArray = $existing['images'] ? json_decode($existing['images'], true) : [];
        }
    } else {
        $imagesArray = $existing['images'] ? json_decode($existing['images'], true) : [];
    }
    
    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadedUrl = handleFileUpload($_FILES['image']);
        if ($uploadedUrl) {
            $imagesArray[] = ['url' => $uploadedUrl, 'caption' => ''];
        }
    }
    
    $db->beginTransaction();
    try {
        $db->query(
            'UPDATE portfolio SET title = ?, category = ?, images = ?, video = ?, `order` = ? WHERE id = ?',
            [sanitizeString($title, 200), $category, json_encode($imagesArray), $video, $order, $id]
        );
        
        // Replace images
        $db->delete('portfolio_images', 'portfolio_id = ?', [$id]);
        foreach ($imagesArray as $i => $img) {
            $db->insert('portfolio_images', [
                'id' => generateUUID(),
                'portfolio_id' => $id,
                'url' => $img['url'],
                'caption' => $img['caption'] ?? '',
                'order' => $i + 1
            ]);
        }
        
        // Featured media
        if ($featuredMedia !== null) {
            $db->delete('portfolio_featured', 'portfolio_id = ?', [$id]);
            $fm = is_string($featuredMedia) ? json_decode($featuredMedia, true) : $featuredMedia;
            if ($fm && !empty($fm['url'])) {
                $db->insert('portfolio_featured', [
                    'portfolio_id' => $id,
                    'url' => $fm['url'],
                    'caption' => $fm['caption'] ?? ''
                ]);
            }
        }
        
        $db->commit();
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
    logUserAction($user['userId'], 'update_portfolio', [
        'portfolioId' => $id,
        'title' => $title,
        'category' => $category,
        'timestamp' => date('d.m.Y H:i:s')
    ], null, 'content');
    
    $result = $db->fetchOne('SELECT * FROM portfolio WHERE id = ?', [$id]);
    $result['images'] = $imagesArray;
    $result['featuredMedia'] = $featuredMedia !== null ? (is_string($featuredMedia) ? json_decode($featuredMedia, true) : $featuredMedia) : null;
    
    jsonResponse($result);
}

function updateCategories($user) {
    $db = Database::getInstance();
    $data = getJsonBody();
    
    // Categories stored as JSON
    $categoriesJson = json_encode($data);
    $db->query('UPDATE categories SET data = ? LIMIT 1', [$categoriesJson]);
    
    jsonResponse(['success' => true]);
}

function updateLayout($user) {
    $db = Database::getInstance();
    $data = getJsonBody();
    
    // Get current layout
    $current = $db->fetchOne('SELECT data FROM layout LIMIT 1');
    $currentLayout = $current ? json_decode($current['data'] ?? '[]', true) : [];
    
    // Update layout
    $layoutJson = json_encode($data);
    $db->query('UPDATE layout SET data = ? LIMIT 1', [$layoutJson]);
    
    // Track changes
    $changedFields = [];
    foreach ($data as $item) {
        $currentItem = array_filter($currentLayout, fn($c) => ($c['id'] ?? '') === ($item['id'] ?? ''));
        $currentItem = array_values($currentItem)[0] ?? null;
        if (!$currentItem || ($currentItem['visible'] ?? null) !== ($item['visible'] ?? null)) {
            $changedFields[] = ($item['id'] ?? 'unknown') . ': ' . ($item['visible'] ? 'widoczne' : 'ukryte');
        }
    }
    
    if (!empty($changedFields)) {
        logUserAction($user['userId'], 'update_layout', [
            'changedFields' => $changedFields,
            'timestamp' => date('d.m.Y H:i:s')
        ], null, 'content');
    }
    
    jsonResponse(['success' => true]);
}
