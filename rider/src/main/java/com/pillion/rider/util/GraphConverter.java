package com.pillion.rider.util;

import java.util.Map;
import java.util.TreeMap;

import com.pillion.rider.model.Graph;
import com.pillion.rider.model.GraphMapper;
import com.pillion.rider.repository.GraphMapperRepository;

import lombok.Data;

@Data                                                  
public class GraphConverter {

    private GraphMapperRepository graphMapperRepository;
    
    public Integer[][] convertToMatrix(Graph graph) {
        Integer[][] graphMatrix = new Integer[graph.getGraph().size()][graph.getGraph().size()];
        TreeMap<String, Integer> map = new TreeMap<>();
        int i=0;
        for(Map.Entry<String, TreeMap<String, Integer>> entry: graph.getGraph().entrySet())
            map.put(entry.getKey(), i++);
        GraphMapper graphMapper = new GraphMapper();
        graphMapper.setId("graphMap");
        graphMapper.setGraphMap(map);
        graphMapperRepository.save(graphMapper);

        for(Map.Entry<String, TreeMap<String, Integer>> entry : graph.getGraph().entrySet())
            for(Map.Entry<String, Integer> subEntry: entry.getValue().entrySet())
                graphMatrix[map.get(entry.getKey())][map.get(subEntry.getKey())] = subEntry.getValue();
        return graphMatrix;
    }

}
