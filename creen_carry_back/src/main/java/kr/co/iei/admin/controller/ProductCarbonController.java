package kr.co.iei.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.admin.model.service.ProductCarbonService;
import kr.co.iei.admin.model.vo.ProductCarbon;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping("/carbon-list")
@RequiredArgsConstructor
public class ProductCarbonController {

	private final ProductCarbonService  productCarbonService;
	
	@GetMapping
	public ResponseEntity<List<ProductCarbon>> getCarbonList(){
		
		List<ProductCarbon> list = productCarbonService.getCarbonList();
		
		return ResponseEntity.ok(list);
	}
	
	@DeleteMapping("carbon-list/{productId}")
	public ResponseEntity<?> deleteContainer(@PathVariable Integer productId){
		return ResponseEntity.ok("");	
	}
}
