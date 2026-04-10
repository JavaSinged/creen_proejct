package kr.co.iei.admin.model.vo;

import lombok.Data;

@Data
public class ProductCarbon {
	private int productId;
	private String productMaterial;
	private double productEmissions;
	private String productImg;
	private String productDesc;
}
