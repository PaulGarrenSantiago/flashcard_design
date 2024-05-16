package com.labactivity.flashcarddesign

import androidx.recyclerview.widget.RecyclerView
import com.labactivity.flashcarddesign.databinding.ItemLayoutBinding

class ItemViewHolder(private val binding:ItemLayoutBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(item:FlashcardsList){
        binding.categoryTextview1.text =item.title
        binding.categoryIcon1.setImageResource(item.image)

    }
}